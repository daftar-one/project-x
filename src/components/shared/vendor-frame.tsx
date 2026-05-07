"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "./icon";
import { Avatar } from "./avatar";
import { useVendorStore } from "@/store/vendor-auth";

interface VendorFrameProps {
  children: ReactNode;
  movies?: string[];
  selectedMovie?: string | null;
}

export function VendorFrame({ children, movies, selectedMovie }: VendorFrameProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { name, email, clearVendor } = useVendorStore();

  const vendorName = name || email || "Prime VFX Studios";

  function handleLogout() {
    clearVendor();
    router.push("/vendor/login");
  }

  return (
    <div className="app">
      <aside className="app-sidebar">
        <div className="flex items-center gap-2.5 px-5 pt-1 pb-4">
          <div className="w-[30px] h-[30px] rounded-lg shrink-0 bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white">
            <Icon name="film" size={16} stroke={1.5} />
          </div>
          <span className="text-[14px] font-bold text-[#f0f2f5] tracking-[-0.02em]">Studio OS</span>
        </div>

        <div
          className={`side-item${pathname === "/vendor/portal" && !selectedMovie ? " active" : ""}`}
          onClick={() => router.push("/vendor/portal")}
        >
          <Icon name="list" size={16} stroke={1.5} />
          <span>Payment Insights</span>
        </div>

        <div className="sidebar-scroll">
          {movies && movies.length > 0 && (
            <>
              <div className="side-section-label">Movies</div>
              {movies.map(movie => (
                <div
                  key={movie}
                  className={`side-item-project${selectedMovie === movie ? " active" : ""}`}
                  onClick={() => router.push(`/vendor/portal?movie=${encodeURIComponent(movie)}`)}
                  title={movie}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-[2px] shrink-0"
                    style={{ background: selectedMovie === movie ? "#a5b4fc" : "#374151" }}
                  />
                  <span className="overflow-hidden text-ellipsis flex-1">{movie}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div
          className="flex items-center gap-2.5 px-5 py-2 cursor-pointer rounded-lg mx-2 mb-0.5 hover:bg-[rgba(255,255,255,.04)]"
          onClick={() => router.push("/vendor/portal/profile")}
        >
          <Avatar name={vendorName} color="#6366f1" size={28} />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#e5e7eb] whitespace-nowrap overflow-hidden text-ellipsis">{vendorName}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.05em]">Vendor</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 mx-2 mb-1 rounded-lg border-0 cursor-pointer bg-transparent text-gray-500 text-[13px] font-medium w-[calc(100%-16px)] transition-[background,color] duration-[120ms] hover:bg-[rgba(239,68,68,.08)] hover:text-[#fca5a5]"
        >
          <Icon name="logout" size={15} />
          <span>Log out</span>
        </button>
      </aside>

      <div className="app-main">
        <div className="app-canvas">
          {children}
        </div>
        <div className="px-6 py-2 border-t border-[rgba(255,255,255,.04)] text-[11px] text-[#374151] text-center shrink-0">
          Powered by{' '}
          <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" className="text-[#4b5563] no-underline hover:text-gray-400">Daftar.One</a>
        </div>
      </div>
    </div>
  );
}
