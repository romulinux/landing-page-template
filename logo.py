import matplotlib.pyplot as plt
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties

# Generate text paths for "Pet" and "Lovers"
font_prop = FontProperties(family='DejaVu Sans', weight='bold')

tp_pet = TextPath((0, 0), "Pet", size=120, prop=font_prop)
tp_lovers = TextPath((0, 0), "Lovers", size=120, prop=font_prop)

def path_to_svg_d(text_path, offset_x=0, offset_y=0):
    commands = []
    for vertices, code in text_path.iter_segments():
        if code == text_path.MOVETO:
            commands.append(f"M {vertices[0]+offset_x:.2f} {-vertices[1]+offset_y:.2f}")
        elif code == text_path.LINETO:
            commands.append(f"L {vertices[0]+offset_x:.2f} {-vertices[1]+offset_y:.2f}")
        elif code == text_path.CURVE3:
            commands.append(f"Q {vertices[0]+offset_x:.2f} {-vertices[1]+offset_y:.2f} {vertices[2]+offset_x:.2f} {-vertices[3]+offset_y:.2f}")
        elif code == text_path.CURVE4:
            commands.append(f"C {vertices[0]+offset_x:.2f} {-vertices[1]+offset_y:.2f} {vertices[2]+offset_x:.2f} {-vertices[3]+offset_y:.2f} {vertices[4]+offset_x:.2f} {-vertices[5]+offset_y:.2f}")
        elif code == text_path.CLOSEPOLY:
            commands.append("Z")
    return " ".join(commands)

# Calculate widths
bbox_pet = tp_pet.get_extents()
bbox_lovers = tp_lovers.get_extents()

width_pet = bbox_pet.width
width_lovers = bbox_lovers.width
total_width = width_pet + width_lovers

start_x = 400 - (total_width / 2)
y_pos = 420

d_pet = path_to_svg_d(tp_pet, start_x, y_pos)
d_lovers = path_to_svg_d(tp_lovers, start_x + width_pet, y_pos)

svg_path_version = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="petGradient" x1="10%" y1="90%" x2="90%" y2="10%">
      <stop offset="0%" stop-color="#2bb3a3" />
      <stop offset="45%" stop-color="#3cd0b3" />
      <stop offset="80%" stop-color="#ff8a3d" />
      <stop offset="100%" stop-color="#ff7a28" />
    </linearGradient>
  </defs>

  <!-- Outer Ring with gap at bottom -->
  <path d="M 330 690 
           A 330 330 0 1 1 470 690" 
        fill="none" 
        stroke="url(#petGradient)" 
        stroke-width="48" 
        stroke-linecap="round" />

  <!-- Heart Shape integrated smoothly at bottom -->
  <path d="M 400 765 
           C 340 715, 315 660, 330 625 
           C 348 582, 388 592, 400 618 
           C 412 592, 452 582, 470 625 
           C 485 660, 460 715, 400 765 Z" 
        fill="none" 
        stroke="url(#petGradient)" 
        stroke-width="48" 
        stroke-linecap="round" 
        stroke-linejoin="round" />

  <!-- Vectorized Text: Pet -->
  <path d="{d_pet}" fill="#2bb3a3" />

  <!-- Vectorized Text: Lovers -->
  <path d="{d_lovers}" fill="#ff8a3d" />
</svg>
"""

with open("logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_path_version)

print("Vectorized SVG saved as logo_petlovers.svg")