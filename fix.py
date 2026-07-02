import re

with open("d:/Nichi-In/Experimental/SP_Telecom/stitch_sb_telecom_co_work_space_management_admin/schedule.html", "r", encoding="utf-8") as f:
    html = f.read()

start_idx = html.find("<!-- Room: The Boardroom -->")
end_idx = html.find("<script>")

rooms_data = [
    ("the-boardroom", "The Boardroom", "Cap: 12 &bull; Screen"),
    ("creative-hub-a", "Creative Hub A", "Cap: 4 &bull; Whiteboard"),
    ("podcast-studio", "Podcast Studio", "Cap: 2 &bull; A/V"),
    ("focus-pod", "Focus Pod", "Cap: 1 &bull; None"),
    ("studio-b", "Studio B", "Cap: 8 &bull; Mic"),
    ("executive-suite", "Executive Suite", "Cap: 10 &bull; Screen"),
    ("conf-a", "Conference Room A", "Cap: 6 &bull; Screen"),
    ("conf-b", "Conference Room B", "Cap: 6 &bull; Screen"),
    ("training-room", "Training Room", "Cap: 20 &bull; Projector"),
    ("phone-booth-1", "Phone Booth 1", "Cap: 1"),
    ("phone-booth-2", "Phone Booth 2", "Cap: 1"),
    ("edit-bay-1", "Edit Bay 1", "Cap: 2 &bull; Mac Pro"),
    ("edit-bay-2", "Edit Bay 2", "Cap: 2 &bull; Mac Pro")
]

room_template = """                    <!-- Room: {name} -->
                    <div class="flex border-b border-outline-variant/50 group hover:bg-surface-container-lowest transition-colors relative min-h-[80px] room-row" data-room="{id}">
                        <div class="w-64 shrink-0 p-4 border-r border-outline-variant flex flex-col justify-center bg-surface-container-lowest group-hover:bg-surface-container-low transition-colors sticky left-0 z-20">
                            <div class="font-label-md text-on-surface font-bold">{name}</div>
                            <div class="text-[12px] text-on-surface-variant">{desc}</div>
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
"""

rooms_html = ""
for room in rooms_data:
    rooms_html += room_template.format(id=room[0], name=room[1], desc=room[2])

closing_tags = """                </div>
            </div>
        </div>
    </main>

    """

new_html = html[:start_idx] + rooms_html + closing_tags + html[end_idx:]

with open("d:/Nichi-In/Experimental/SP_Telecom/stitch_sb_telecom_co_work_space_management_admin/schedule.html", "w", encoding="utf-8") as f:
    f.write(new_html)
