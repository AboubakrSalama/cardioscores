# Generates icon.png (1024, for @capacitor/assets) and www/icons/*.png (PWA manifest)
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$size = 1024
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Rounded-rect background with vertical-diagonal gradient
$r = 224
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc(0, 0, $r*2, $r*2, 180, 90)
$path.AddArc($size-$r*2, 0, $r*2, $r*2, 270, 90)
$path.AddArc($size-$r*2, $size-$r*2, $r*2, $r*2, 0, 90)
$path.AddArc(0, $size-$r*2, $r*2, $r*2, 90, 90)
$path.CloseFigure()
$c1 = [System.Drawing.Color]::FromArgb(255, 18, 90, 153)
$c2 = [System.Drawing.Color]::FromArgb(255, 10, 58, 99)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point(0,0)), (New-Object System.Drawing.Point($size,$size)), $c1, $c2)
$g.FillPath($brush, $path)

# Heart outline (cubic beziers matching assets/icon.svg)
$heart = New-Object System.Drawing.Drawing2D.GraphicsPath
$heart.AddBezier(512,800, 400,720, 232,600, 232,440)
$heart.AddBezier(232,440, 232,340, 308,272, 398,272)
$heart.AddBezier(398,272, 458,272, 494,304, 512,336)
$heart.AddBezier(512,336, 530,304, 566,272, 626,272)
$heart.AddBezier(626,272, 716,272, 792,340, 792,440)
$heart.AddBezier(792,440, 792,600, 624,720, 512,800)
$penH = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 46)
$penH.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($penH, $heart)

# ECG trace
$pts = @(
  (New-Object System.Drawing.Point(270,520)), (New-Object System.Drawing.Point(400,520)),
  (New-Object System.Drawing.Point(448,420)), (New-Object System.Drawing.Point(512,610)),
  (New-Object System.Drawing.Point(576,470)), (New-Object System.Drawing.Point(610,520)),
  (New-Object System.Drawing.Point(754,520))
)
$penE = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 90, 209, 165), 40)
$penE.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$penE.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$penE.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLines($penE, $pts)

$g.Dispose()
$bmp.Save("$root\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

New-Item -ItemType Directory -Force "$root\www\icons" | Out-Null
foreach ($s in @(512, 192)) {
  $small = New-Object System.Drawing.Bitmap($bmp, $s, $s)
  $small.Save("$root\www\icons\icon-$s.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $small.Dispose()
}
$bmp.Dispose()
Write-Output "Icons written: assets\icon.png (1024), www\icons\icon-512.png, www\icons\icon-192.png"
