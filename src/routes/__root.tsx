import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { AuthProvider } from "@/lib/auth/provider"
import { PreviewHostBridge } from "@/components/preview-host-bridge"
import { Shell } from "@/components/lot/shell"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "THE LOT" },
      {
        name: "description",
        content:
          "Free mixtapes, singles, and videos from artists who own their music. Stream on The Lot or cop the file to your phone.",
      },
      { name: "theme-color", content: "#110e0b" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Shell>
            <Outlet />
          </Shell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
})
