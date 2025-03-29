"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils";

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: formData.name,
      email: formData.email,
      avatar: user?.avatar || "https://github.com/shadcn.png",
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.h1 variants={fadeInUp} className="text-3xl font-bold">
        Profile
      </motion.h1>

      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details here.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Manage your notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">Email Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notificationEmail"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="notificationEmail">
                      Receive email notifications
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingEmail">Marketing Emails</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="marketingEmail"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="marketingEmail">
                      Receive marketing emails
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
