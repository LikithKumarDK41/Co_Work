$html = Get-Content "d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\schedule.html" -Raw

$startIdx = $html.IndexOf("<!-- Room: The Boardroom -->")
$endIdx = $html.IndexOf("<script>")

$roomsData = @(
    @("the-boardroom", "The Boardroom", "Cap: 12 &bull; Screen"),
    @("creative-hub-a", "Creative Hub A", "Cap: 4 &bull; Whiteboard"),
    @("podcast-studio", "Podcast Studio", "Cap: 2 &bull; A/V"),
    @("focus-pod", "Focus Pod", "Cap: 1 &bull; None"),
    @("studio-b", "Studio B", "Cap: 8 &bull; Mic"),
    @("executive-suite", "Executive Suite", "Cap: 10 &bull; Screen"),
    @("conf-a", "Conference Room A", "Cap: 6 &bull; Screen"),
    @("conf-b", "Conference Room B", "Cap: 6 &bull; Screen"),
    @("training-room", "Training Room", "Cap: 20 &bull; Projector"),
    @("phone-booth-1", "Phone Booth 1", "Cap: 1"),
    @("phone-booth-2", "Phone Booth 2", "Cap: 1"),
    @("edit-bay-1", "Edit Bay 1", "Cap: 2 &bull; Mac Pro"),
    @("edit-bay-2", "Edit Bay 2", "Cap: 2 &bull; Mac Pro")
)

$roomTemplate = @"
                    <!-- Room: {1} -->
                    <div class="flex border-b border-outline-variant/50 group hover:bg-surface-container-lowest transition-colors relative min-h-[80px] room-row" data-room="{0}">
                        <div class="w-64 shrink-0 p-4 border-r border-outline-variant flex flex-col justify-center bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors sticky left-0 z-20">
                            <div class="font-label-md text-on-surface font-bold">{1}</div>
                            <div class="text-[12px] text-on-surface-variant">{2}</div>
                        </div>
                        <div class="flex-1 relative">
                            <!-- Background Grid -->
                            <div class="absolute inset-0 flex pointer-events-none">
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0 border-r border-outline-variant/30"></div>
                                <div class="w-[10%] shrink-0"></div>
                            </div>
                            <!-- Events Container -->
                            <div class="events-container absolute inset-0 pointer-events-none"></div>
                        </div>
                    </div>
"@

$roomsHtml = ""
foreach ($room in $roomsData) {
    $roomsHtml += $roomTemplate -f $room[0], $room[1], $room[2]
}

$closingTags = @"
                </div>
            </div>
        </div>
    </main>

"@

$newHtml = $html.Substring(0, $startIdx) + $roomsHtml + "`r`n" + $closingTags + "`r`n                    " + $html.Substring($endIdx)

Set-Content -Path "d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\schedule.html" -Value $newHtml
