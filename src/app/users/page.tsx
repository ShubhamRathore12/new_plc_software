"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import CreatableSelect from "react-select/creatable";
import { Loader2, Pencil, Search, Trash2, Users as UsersIcon } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import { useDataStore } from "@/lib/store";
import { MONITOR_ACCESS_OPTIONS } from "@/lib/monitorOptions";

const PAGE_SIZE = 50;

// Same Go backend the rest of the app talks to — no Next.js proxy route.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://www.primeosys.com/backend";

interface ApiUser {
  id: number;
  accountType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  monitorAccess: string | string[] | number | null;
  location?: string | null;
  created_at: string;
}

interface EditForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  location: string;
  accountType: string;
  password: string;
  monitorAccess: string[];
}

/** monitorAccess arrives as CSV, an array, or 0 — normalise to a string list. */
function toAccessList(value: ApiUser["monitorAccess"]): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    if (value === "0" || value.trim() === "") return [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

/** Bearer header built from the login token (cookie, or the login response in the store). */
function authHeaders(storeToken?: string): Record<string, string> {
  const token = Cookies.get("auth_token") || storeToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(value: string) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export default function UsersPage() {
  const { data } = useDataStore() as {
    data: { user?: { id?: number; accountType?: string }; token?: string };
  };
  const currentUser = data?.user;
  const storeToken = data?.token;
  const isManufactura = currentUser?.accountType === "manufactura";

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<ApiUser | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(page * PAGE_SIZE),
      });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

      const res = await fetch(`${BACKEND_URL}/api/users?${params.toString()}`, {
        method: "GET",
        headers: authHeaders(storeToken),
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load users");
      }

      setUsers(Array.isArray(json.data) ? json.data : []);
      setCount(
        typeof json.count === "number" ? json.count : json.data?.length ?? 0
      );
    } catch (error) {
      setUsers([]);
      setCount(0);
      toast.error("Failed to load users", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, storeToken]);

  useEffect(() => {
    if (isManufactura) fetchUsers();
  }, [fetchUsers, isManufactura]);

  // A new search starts back at the first page
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const openEdit = (user: ApiUser) => {
    setEditing(user);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      company: user.company || "",
      location: user.location || "",
      accountType: user.accountType || "customer",
      password: "",
      monitorAccess: toAccessList(user.monitorAccess),
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
  };

  const saveUser = async () => {
    if (!editing || !form) return;
    setSaving(true);
    try {
      // Partial update — send only fields that actually changed
      const payload: Record<string, unknown> = {};
      const original = {
        firstName: editing.firstName || "",
        lastName: editing.lastName || "",
        username: editing.username || "",
        email: editing.email || "",
        phoneNumber: editing.phoneNumber || "",
        company: editing.company || "",
        location: editing.location || "",
        accountType: editing.accountType || "",
      };

      (Object.keys(original) as (keyof typeof original)[]).forEach((key) => {
        if (form[key] !== original[key]) payload[key] = form[key];
      });

      const originalAccess = toAccessList(editing.monitorAccess);
      if (form.monitorAccess.join(",") !== originalAccess.join(",")) {
        payload.monitorAccess = form.monitorAccess;
      }
      if (form.password.trim()) payload.password = form.password.trim();

      if (Object.keys(payload).length === 0) {
        toast.info("Nothing to update");
        setSaving(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders(storeToken) },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.status === 409) {
        throw new Error(json?.message || "Username already taken");
      }
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Update failed");
      }

      toast.success("User updated successfully");
      closeEdit();
      fetchUsers();
    } catch (error) {
      toast.error("Update failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${deleting.id}`, {
        method: "DELETE",
        headers: authHeaders(storeToken),
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Delete failed");
      }

      toast.success("User deleted successfully");
      setDeleting(null);
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setDeletingBusy(false);
    }
  };

  const accessOptions = useMemo(() => {
    const known = new Set(MONITOR_ACCESS_OPTIONS.map((o) => o.value));
    const extra = (form?.monitorAccess || [])
      .filter((v) => !known.has(v))
      .map((value) => ({ value, label: value }));
    return [...extra, ...MONITOR_ACCESS_OPTIONS];
  }, [form?.monitorAccess]);

  if (!isManufactura) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
          <UsersIcon className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">User management unavailable</h2>
          <p className="text-sm text-muted-foreground">
            This section is only available to manufactura accounts.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 p-2 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Edit or remove accounts. {count} user{count === 1 ? "" : "s"} shown.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, username, email, company"
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Monitor Access</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const access = toAccessList(user.monitorAccess);
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                          "-"}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user.phoneNumber || "-"}</TableCell>
                      <TableCell>{user.company || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.accountType || "-"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[260px]">
                        {access.length === 0 ? (
                          <span className="text-muted-foreground">All</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {access.slice(0, 3).map((item) => (
                              <Badge key={item} variant="outline">
                                {item}
                              </Badge>
                            ))}
                            {access.length > 3 && (
                              <Badge variant="outline">+{access.length - 3}</Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(user)}
                          aria-label={`Edit ${user.username}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf}
                          title={
                            isSelf
                              ? "You cannot delete your own account"
                              : "Delete user"
                          }
                          onClick={() => setDeleting(user)}
                          aria-label={`Delete ${user.username}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={loading || users.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Only changed fields are sent. Leave the password blank to keep the
              current one.
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account type</Label>
                <Select
                  value={form.accountType}
                  onValueChange={(value) =>
                    setForm({ ...form, accountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufactura">manufactura</SelectItem>
                    <SelectItem value="manufacturer">manufacturer</SelectItem>
                    <SelectItem value="customer">customer</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Monitor access</Label>
                <CreatableSelect
                  isMulti
                  className="text-sm"
                  classNamePrefix="rs"
                  options={accessOptions}
                  value={form.monitorAccess.map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      monitorAccess: (selected || []).map((item) => item.value),
                    })
                  }
                  placeholder="Select or type machine / section names"
                />
                <p className="text-xs text-muted-foreground">
                  Empty means full access.
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveUser} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `"${deleting.username}" will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteUser();
              }}
              disabled={deletingBusy}
            >
              {deletingBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
