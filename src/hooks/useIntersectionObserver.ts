import { useState, useEffect, useRef, RefObject, JSX } from 'react';





interface IntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends Element>({
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
}: IntersectionObserverOptions = {}): [RefObject<T>, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const elementRef = useRef<any>(null); // ✅ let TS infer type
    const hasTriggered = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isElementIntersecting = entry.isIntersecting;

                if (triggerOnce && hasTriggered.current && isElementIntersecting) {
                    return;
                }

                setIsIntersecting(isElementIntersecting);

                if (triggerOnce && isElementIntersecting) {
                    hasTriggered.current = true;
                    observer.disconnect();
                }
            },
            { root, rootMargin, threshold }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [root, rootMargin, threshold, triggerOnce]);

    return [elementRef, isIntersecting];
}


/**
 * Component that lazy loads its children when it becomes visible in the viewport
 */
interface LazyLoadProps {
    children: React.ReactNode;
    placeholder: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
}

export function LazyLoadOnVisible({
    children,
    placeholder,
    rootMargin = '200px',
    threshold = 0,
}: LazyLoadProps): any {
    const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
        rootMargin,
        threshold,
        triggerOnce: true,
    });

    // return (
    //     <div ref= { ref } >
    //     { isVisible? children: placeholder }
    //     </div>
    // );
}
