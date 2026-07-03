const fs = require('fs');

const dashboardPath = "d:\\\\Nichi-In\\\\Experimental\\\\SP_Telecom\\\\Member\\\\dashboard.html";
const adminCode = "d:\\\\Nichi-In\\\\Experimental\\\\SP_Telecom\\\\stitch_sb_telecom_co_work_space_management_admin\\\\admin_dashboard_co_work_manager\\\\code.html";

// read tailwind config from admin code
const adminHtml = fs.readFileSync(adminCode, 'utf8');
const match = adminHtml.match(/(<script id="tailwind-config">[\s\S]*?<\/script>)/);
const tailwindConfig = match[1];

const htmlContent = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Member Dashboard -Nichi-In</title>
<link href="layout.css" rel="stylesheet">
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&amp;display=swap" rel="stylesheet">
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Configuration -->
${tailwindConfig}
<style type="text/tailwindcss">
        @layer utilities {
            .page-layout {
                @apply flex-1 md:ml-64 p-4 md:p-8 max-w-[1440px] mx-auto w-full;
            }
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
        }
</style>
<script src="layout.js" defer></script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans min-h-screen flex antialiased">
<main class="page-layout flex-1 min-h-screen py-12">
<div class="max-w-[1440px] mx-auto">
<!-- Hero Section -->
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
    <div class="min-w-0">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Tuesday, October 24</p>
        <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Good morning, Alex.</h2>
        <p class="text-base text-slate-500 mt-2 max-w-2xl">Here's a snapshot of your day atNichi-In. Your next meeting is in 45 minutes.</p>
    </div>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-12 gap-6">
<!-- Upcoming Bookings (Span 8) -->
<div class="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col p-6">
    <div class="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Upcoming Bookings</h3>
        <a class="text-blue-600 font-semibold text-xs hover:text-blue-700 transition-colors uppercase tracking-widest bg-blue-50/50 px-3 py-1.5 rounded-full flex items-center gap-1.5" href="my_booking.html">
            <span>View all</span>
            <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
        </a>
    </div>
    <div class="space-y-2">
        <!-- Booking Item 1 -->
        <div class="p-4 hover:bg-slate-50/80 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer border border-transparent hover:border-slate-100">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span class="material-symbols-outlined text-blue-600">meeting_room</span>
                </div>
                <div>
                    <h4 class="text-sm font-semibold text-slate-800">Boardroom A (The Conservatory)</h4>
                    <p class="text-xs text-slate-500 mt-1">10:00 AM - 11:30 AM &bull; Design Review</p>
                </div>
            </div>
            <div class="bg-emerald-50 text-emerald-700 font-semibold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shrink-0 text-center">
                Confirmed
            </div>
        </div>
        <!-- Booking Item 2 -->
        <div class="p-4 hover:bg-slate-50/80 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer border border-transparent hover:border-slate-100">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span class="material-symbols-outlined text-purple-600">mic</span>
                </div>
                <div>
                    <h4 class="text-sm font-semibold text-slate-800">Podcast Studio 2</h4>
                    <p class="text-xs text-slate-500 mt-1">2:00 PM - 4:00 PM &bull; Client Recording</p>
                </div>
            </div>
            <div class="bg-emerald-50 text-emerald-700 font-semibold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shrink-0 text-center">
                Confirmed
            </div>
        </div>
    </div>
</div>

<!-- Expected Visitors (Span 4) -->
<div class="col-span-12 lg:col-span-4 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col p-6">
    <div class="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Expected Visitors</h3>
        <a class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500" href="invite_visitor.html">
            <span class="material-symbols-outlined">add</span>
        </a>
    </div>
    <div class="flex-1 space-y-6">
        <!-- Visitor 1 -->
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">SJ</div>
            <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">Sarah Jenkins</p>
                <p class="text-xs text-slate-500 mt-0.5">Design Agency Inc.</p>
            </div>
            <div class="text-right">
                <p class="text-sm font-semibold text-slate-900">9:45 AM</p>
                <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mt-0.5">Arrived</p>
            </div>
        </div>
        <!-- Visitor 2 -->
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm">MR</div>
            <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">Michael Ross</p>
                <p class="text-xs text-slate-500 mt-0.5">Freelance Developer</p>
            </div>
            <div class="text-right">
                <p class="text-sm font-semibold text-slate-900">2:00 PM</p>
                <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Expected</p>
            </div>
        </div>
    </div>
    <a class="mt-6 w-full border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors block text-center" href="invite_visitor.html">
        Register New Visitor
    </a>
</div>

<!-- Announcements Carousel (Span 6) -->
<div class="col-span-12 lg:col-span-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group cursor-pointer relative h-[350px]">
    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="A high-end, cinematic photograph of a luxurious co-working space coffee lounge bathed in soft, natural morning light." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjcgZ6B_9aSYgbE4OVeR9iyJa5CkF-ABdyFMEG3Ut7UkndgpvLlAC3ION92kXuurnt2oBfJE_AKhlDlTowZr6nAEyR4BKhokNfxb5rXqA4e0AaS0kYNsEQ9ivDPna_oxTq0dBmAbFNpcwq8EFqy-gJ0az1yWcPmoG4_sWIvFhZr_KnEwN1cfK6hgzEcbAgWyEn-AcE-XzAnBcTUreoYunrNLF_n7z1NGBA56i3GFKNUx-DkAfNqoCO3h60Icr_j4lf36JHUgbBRGCb')"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
    <div class="absolute bottom-0 left-0 p-8 w-full">
        <span class="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full mb-3 inline-block border border-white/30 uppercase tracking-wider">Community</span>
        <h3 class="text-2xl font-bold text-white mb-2">New single-origin roast at the Lounge</h3>
        <p class="text-sm text-slate-200 line-clamp-2">Join us in the main atrium to taste the new Ethiopian Yirgacheffe blend, available all week for premium members.</p>
    </div>
</div>

<!-- Recent Notifications (Span 6) -->
<div class="col-span-12 lg:col-span-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 h-[350px] flex flex-col">
    <div class="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
    </div>
    <div class="space-y-0 overflow-y-auto pr-2 flex-1">
        <!-- Notification 1 -->
        <div class="flex gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl cursor-pointer">
            <div class="mt-1 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
            <div>
                <p class="text-sm font-semibold text-slate-900">Your invoice for October has been paid.</p>
                <p class="text-xs text-slate-500 mt-1">2 hours ago</p>
            </div>
        </div>
        <!-- Notification 2 -->
        <div class="flex gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl cursor-pointer">
            <div class="mt-1 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[16px]">local_shipping</span>
            </div>
            <div>
                <p class="text-sm font-semibold text-slate-900">Package delivered to the front desk.</p>
                <p class="text-xs text-slate-500 mt-1">Yesterday, 3:15 PM</p>
            </div>
        </div>
        <!-- Notification 3 -->
        <div class="flex gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl cursor-pointer">
            <div class="mt-1 w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[16px]">campaign</span>
            </div>
            <div>
                <p class="text-sm font-semibold text-slate-900">Reminder: Community Happy Hour starts at 5 PM.</p>
                <p class="text-xs text-slate-500 mt-1">Yesterday, 9:00 AM</p>
            </div>
        </div>
    </div>
</div>

</div>
</div>
</main>
</body></html>`;

fs.writeFileSync(dashboardPath, htmlContent, 'utf8');
