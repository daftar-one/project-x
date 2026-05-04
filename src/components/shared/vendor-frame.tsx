"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "./icon";
import { Avatar } from "./avatar";
import { useVendorStore } from "@/store/vendor-auth";

interface VendorFrameProps {
  children: ReactNode;
}

export function VendorFrame({ children }: VendorFrameProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { name, email, clearVendor } = useVendorStore();

  const vendorName = name || email || "Vendor";

  function handleLogout() {
    clearVendor();
    router.push("/vendor/login");
  }

  return (
    <div className="app">
      <aside className="app-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 20px 16px" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#6366f1,#e83e8c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff",
          }}>
            <Icon name="film" size={16} stroke={1.5} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f2f5", letterSpacing: "-.02em" }}>Project X</span>
        </div>

        <div className="sidebar-scroll">
          <div
            className={`side-item${pathname === "/vendor/portal" ? " active" : ""}`}
            onClick={() => router.push("/vendor/portal")}
          >
            <Icon name="list" size={16} stroke={1.5} />
            <span>Payment History</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", margin: "0 8px 2px",
            borderRadius: 8, border: "none", cursor: "pointer", background: "transparent",
            color: "#6b7280", fontSize: 13, fontWeight: 500, width: "calc(100% - 16px)",
            transition: "background .12s ease, color .12s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; e.currentTarget.style.color = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
        >
          <Icon name="logout" size={15} />
          <span>Log out</span>
        </button>

        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px 8px", cursor: "pointer", borderRadius: 8, margin: "0 8px 4px" }}
          onClick={() => router.push("/vendor/portal/profile")}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Avatar name={vendorName} color="#6366f1" size={28} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e5e7eb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vendorName}</div>
            <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em" }}>Vendor</div>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <div className="app-canvas">
          {children}
        </div>
        <div style={{ padding: '8px 24px', borderTop: '1px solid rgba(255,255,255,.04)', fontSize: 11, color: '#374151', textAlign: 'center', flexShrink: 0 }}>
          Powered by{' '}
          <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" style={{ color: '#4b5563', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
          >Daftar.One</a>
        </div>
      </div>
    </div>
  );
}
