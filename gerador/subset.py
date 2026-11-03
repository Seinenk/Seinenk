"""Gera um subconjunto WOFF2 (base64) só com os caracteres usados no SVG."""
import base64, io, sys
from fontTools import subset

src, text = sys.argv[1], sys.argv[2]
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['kern', 'liga', 'lnum', 'tnum', 'calt']
opts.name_IDs = ['*']
opts.notdef_outline = True
font = subset.load_font(src, opts)
sub = subset.Subsetter(opts)
sub.populate(text=text)
sub.subset(font)
buf = io.BytesIO()
subset.save_font(font, buf, opts)
sys.stdout.write(base64.b64encode(buf.getvalue()).decode())
