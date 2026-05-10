"use client";

import { Icon } from "./icon";
import { fmtShortCur, fmtDateTime, fmtDate, getCurrencySymbol } from "@/lib/format";

export interface BillViewerData {
  id: string;
  vendor_name: string;
  bill_type: string; // breakdown/reason in vendor portal
  amount: number; // in requested currency
  status: string;
  created_at: string; // submittedAt in vendor portal
  bill_date?: string | null;
  file_url?: string | null;
  project_name?: string;
  scene_name?: string;
  currency?: string;
  project_currency?: string;
  exchange_rate?: number;
}

interface BillViewerDialogProps {
  bill: BillViewerData;
  onClose: () => void;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Paid: { bg: "rgba(16,185,129,.15)", color: "#34d399" },
  Approved: { bg: "rgba(16,185,129,.15)", color: "#34d399" },
  Rejected: { bg: "rgba(239,68,68,.15)", color: "#f87171" },
  Pending: { bg: "rgba(245,158,11,.15)", color: "#fbbf24" },
};

export function BillViewerDialog({ bill, onClose }: BillViewerDialogProps) {
  const sc = STATUS_STYLE[bill.status] || { bg: "rgba(255,255,255,.1)", color: "#fff" };
  
  const currency = bill.currency || "INR";
  const projectCurrency = bill.project_currency || "INR";
  const exchangeRate = bill.exchange_rate || 1;
  const convertedAmount = bill.amount * exchangeRate;
  const showConversion = currency !== projectCurrency;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,.72)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-[14px] overflow-hidden"
        style={{ background: "#1a1d23", border: "1px solid rgba(255,255,255,.1)", width: "70vw", height: "94vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col px-6 py-5 border-b border-[rgba(255,255,255,.07)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,.18)] flex items-center justify-center text-[#a5b4fc]">
                <Icon name="file-text" size={15} />
              </div>
              <div className="text-[16px] font-bold text-[#f0f2f5]">{bill.bill_type}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full" style={{ background: sc.bg, color: sc.color }}>
                {bill.status}
              </span>
              <button onClick={onClose} className="text-gray-500 hover:text-[#f0f2f5] transition-colors">
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col grid grid-cols-2 gap-4">
            {/* <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Vendor Name</div>
              <div className="text-[13px] text-[#e5e7eb] font-medium">{bill.vendor_name}</div>
            </div> */}
            {bill.project_name && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Project Name</div>
                <div className="text-[13px] text-[#e5e7eb] font-medium">{bill.project_name}</div>
              </div>
            )}
            {bill.scene_name && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Scene Name</div>
                <div className="text-[13px] text-[#e5e7eb] font-medium">{bill.scene_name}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Submitted On</div>
              <div className="text-[13px] text-[#e5e7eb]">{fmtDateTime(bill.created_at)}</div>
            </div>
            {bill.bill_date && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Bill Date</div>
                <div className="text-[13px] text-[#e5e7eb]">{fmtDate(bill.bill_date)}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Amount</div>
              <div className="text-[14px] text-[#34d399] font-bold">
                <div className="flex items-center gap-2">
                  <div className="text-[13px] text-[#f0f2f5] font-mono">
                    {showConversion ? (
                      <>
                        {getCurrencySymbol(currency)}{bill.amount.toLocaleString()} × {exchangeRate.toFixed(4)} = <span className="text-[#a5b4fc] font-bold">{fmtShortCur(convertedAmount, projectCurrency)}</span>
                      </>
                    ) : (
                      <span className="text-[#34d399] font-bold">{fmtShortCur(bill.amount, projectCurrency)}</span>
                    )}
                  </div>
                  {showConversion && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                      <Icon name="info" size={10} />
                      Source: Google Finance
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* PDF */}
        <div className="flex-1 overflow-hidden bg-[#111317]">
          <iframe src={bill.file_url || "/sample_invoice.pdf"} className="w-full h-full border-0" title="Bill document" />
        </div>
      </div>
    </div>
  );
}
