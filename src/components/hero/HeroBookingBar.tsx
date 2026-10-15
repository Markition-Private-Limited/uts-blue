"use client";

export function HeroBookingBar() {
  return (
    <div className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* Label */}
        <div className="shrink-0">
          <p className="text-base font-bold text-white leading-tight">
            Need to Rent a<br />Luxury Car?
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-10 w-px bg-white/20" />

        {/* Fields */}
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <BookingField label="Full Name" placeholder="Enter Full Name" type="text" />
          <BookingField label="Mobile Number" placeholder="Enter Phone no." type="tel" />
          <BookingField label="Pickup Location" placeholder="Enter Location" type="text" />
          <BookingField label="Pickup Date" placeholder="dd/mm/yyyy" type="text" />
        </div>

        {/* Send button */}
        <button
          type="button"
          className="shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 51.44%, rgba(255,255,255,0) 100%), linear-gradient(0deg, #1648D8, #1648D8)",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function BookingField({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 min-w-0">
      <label className="text-xs font-medium text-white/60">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none border-b border-white/20 pb-1 focus:border-white/60 transition-colors"
      />
    </div>
  );
}
