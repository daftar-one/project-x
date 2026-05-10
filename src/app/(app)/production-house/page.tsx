"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { PageTitle } from '@/components/shared/page-title';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  line_producer: 'Line Producer',
  executive_producer: 'Executive Producer',
  accounts_manager: 'Accounts Manager',
  silent_stakeholder: 'Silent Stakeholder',
};

const TEAM_MEMBERS = [
  { id: 's1', role: 'executive_producer', status: 'pending'  as const, email: 'priya.sharma@studioos.in', name: 'Priya Sharma',  joined_at: '2026-05-12' },
  { id: 's2', role: 'line_producer',      status: 'accepted' as const, email: 'arjun.mehta@studioos.in',  name: 'Arjun Mehta',   joined_at: '2026-05-10' },
  { id: 's3', role: 'accounts_manager',   status: 'accepted' as const, email: 'rahul.nair@studioos.in',   name: 'Rahul Nair',    joined_at: '2026-05-15' },
];

function PHProfileCard({ isLP }: { isLP: boolean }) {
  const { data: house } = useProductionHouse();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(house?.brand_name ?? house?.name ?? 'Studio One Films');
  const [location, setLocation] = useState('Mumbai, Maharashtra');
  const [email, setEmail] = useState('contact@tvfmotionpitctures.in');
  const [phone, setPhone] = useState('+91 22 4567 8900');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleSave = () => {
    setEditing(false);
    toast.success('Production house details updated');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const lblCls = "text-[9px] font-bold text-gray-500 uppercase tracking-[.07em] mb-1 block";
  const valCls = "text-[13px] font-semibold text-[#f0f2f5]";

  return (
    <div className="card p-5">
      <div className="flex items-start gap-5">
        <label className="w-[60px] h-[60px] rounded-[14px] shrink-0 cursor-pointer relative group overflow-hidden shadow-lg" title="Change logo">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white">
              <Icon name="film" size={26} stroke={1.5} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[14px]">
            <Icon name="upload" size={15} style={{ color: 'white' }} />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        </label>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <label className={lblCls}>Production House Name</label>
                <div className="input-underline py-1">
                  <Icon name="building" size={14} />
                  <input value={name} onChange={e => setName(e.target.value)} className="text-[13px]" />
                </div>
              </div>
              <div>
                <label className={lblCls}>Location</label>
                <div className="input-underline py-1">
                  <Icon name="map" size={14} />
                  <input value={location} onChange={e => setLocation(e.target.value)} className="text-[13px]" />
                </div>
              </div>
              <div>
                <label className={lblCls}>Email</label>
                <div className="input-underline py-1">
                  <Icon name="mail" size={14} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="text-[13px]" />
                </div>
              </div>
              <div>
                <label className={lblCls}>Phone Number</label>
                <div className="input-underline py-1">
                  <Icon name="phone" size={14} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="text-[13px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className={lblCls}>Production House</div>
                <div className={valCls}>{name}</div>
              </div>
              <div>
                <div className={lblCls}>Location</div>
                <div className={valCls}>{location}</div>
              </div>
              <div>
                <div className={lblCls}>Email</div>
                <div className={`${valCls} truncate`}>{email}</div>
              </div>
              <div>
                <div className={lblCls}>Phone</div>
                <div className={valCls}>{phone}</div>
              </div>
            </div>
          )}
        </div>

        {isLP && (
          editing ? (
            <div className="flex gap-2 shrink-0">
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-sm shrink-0" onClick={() => setEditing(true)} title="Edit">
              <Icon name="edit" size={13} />
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default function ProductionHousePage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const isLP = user?.role === 'line_producer';

  return (
    <AppFrame>
      <PageTitle title="Production House" />

      <div className="flex flex-col gap-5">
        <PHProfileCard isLP={isLP} />

        {/* Plan Summary */}
        <div 
          className="card p-5 cursor-pointer hover:border-[rgba(99,102,241,.3)] transition-colors relative overflow-hidden group"
          onClick={() => router.push('/plan')}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-[10px] font-bold text-[#6366f1] uppercase tracking-[0.1em] mb-1">Current Plan</div>
              <div className="text-[16px] font-bold text-[#f0f2f5]">Free Beta Plan</div>
              <p className="text-[12px] text-gray-500 mt-1">Full access to all features for 6 months.</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6366f1] group-hover:translate-x-1 transition-transform">
              View Plan Details
              <Icon name="arrowRight" size={14} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366f1] to-[#e83e8c] opacity-[0.03] blur-3xl pointer-events-none" />
        </div>

        {/* Team Members */}
        {/* <div>
          <div className="text-[16px] font-bold tracking-[-0.02em] text-[#f0f2f5] mb-4">Team</div>
          <div className="card">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map(m => (
                  <tr key={m.id} style={{ opacity: m.status === 'accepted' ? 1 : 0.45 }}>
                    <td>
                      <div className="flex items-center gap-[10px]">
                        <div className="w-[28px] h-[28px] rounded-[8px] shrink-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-[11px] font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <div className="font-semibold">{m.name}</div>
                      </div>
                    </td>
                    <td className="text-gray-500">{m.email}</td>
                    <td className="text-gray-400">{ROLE_LABELS[m.role] ?? m.role}</td>
                    <td className="text-gray-400">{m.status === 'accepted' ? 'Accepted' : 'Invited'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </AppFrame>
  );
}
