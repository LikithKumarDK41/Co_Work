$html = Get-Content "d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\schedule.html" -Raw

# Replace header "Resources"
$html = $html -replace '<div class="w-64 shrink-0 p-4 border-r border-outline-variant/80 font-label-md font-semibold text-\[#475569\] bg-\[#f4f7fc\] sticky left-0 z-40 flex items-center justify-start whitespace-nowrap">Resources</div>', '<div class="w-24 md:w-64 shrink-0 p-2 md:p-4 border-r border-outline-variant/80 font-label-md font-bold text-[#475569] uppercase bg-[#f4f7fc] sticky left-0 z-40 flex items-center justify-start overflow-hidden text-[11px] md:text-sm">ROOMS</div>'

# Make sidebars responsive
$html = $html -replace 'w-64 shrink-0 p-4 border-r border-outline-variant flex flex-col justify-center bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors sticky left-0 z-20', 'w-24 md:w-64 shrink-0 p-2 md:p-4 border-r border-outline-variant flex flex-col justify-center bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors sticky left-0 z-20 overflow-hidden'

$html = $html -replace '<div class="font-label-md text-on-surface font-bold">', '<div class="font-label-md text-on-surface font-bold text-xs md:text-sm truncate">'

$html = $html -replace '<div class="text-\[12px\] text-on-surface-variant">', '<div class="text-[9px] md:text-[12px] text-on-surface-variant truncate">'

# Make top time labels responsive
$html = $html -replace 'px-4 py-4 text-\[14px\] text-\[#475569\] font-bold flex items-center justify-start whitespace-nowrap', 'px-2 py-3 md:px-4 md:py-4 text-[11px] md:text-[14px] text-[#475569] font-bold flex items-center justify-start whitespace-nowrap overflow-hidden'

# Make events text responsive inside JS
$html = $html -replace 'p-3 flex justify-between items-start', 'p-1.5 md:p-3 flex justify-between items-start'
$html = $html -replace 'text-\[13px\] font-bold truncate', 'text-[10px] md:text-[13px] font-bold truncate'
$html = $html -replace 'text-\[11px\] opacity-70 truncate', 'text-[8px] md:text-[11px] opacity-70 truncate'
$html = $html -replace 'w-6 h-6 rounded-full', 'w-4 h-4 md:w-6 md:h-6 rounded-full'
$html = $html -replace 'text-\[10px\] font-bold text-gray-600', 'text-[8px] md:text-[10px] font-bold text-gray-600'

Set-Content -Path "d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\schedule.html" -Value $html
