window.__ModuleLoader__.load({
  id: 'dsh-sticky-wall',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef } = React;

    const NS = 'sticky-wall';
    const PANEL_ID = 'sticky-wall';
    const STORAGE_KEY = 'dsh.sticky-wall.v1';
    const PREFS_KEY = 'dsh.sticky-wall.prefs.v1';

    const COLORS = ['amber', 'rose', 'sky', 'mint', 'violet'];
    /** Paper tints. */
    const TONE = {
      amber: '#f4c33f',
      rose: '#f296ac',
      sky: '#8dbde9',
      mint: '#96d3b0',
      violet: '#b09ee0',
    };
    /** Pen inks, kept dark enough to read on every stock. */
    const INK = [
      { id: 'black', hex: '#2f2c27' },
      { id: 'blue', hex: '#2f4f8f' },
      { id: 'red', hex: '#a8392d' },
      { id: 'green', hex: '#2f6b4a' },
      { id: 'violet', hex: '#5f4a9b' },
    ];
    const INK_IDS = INK.map((item) => item.id);
    /** Washi and pin colours are chosen independently of the paper, like a real desk. */
    const TAPE_TONES = ['#7cc0b8', '#efa2b8', '#eec46a', '#c2b1e0', '#b7c3cc', '#f0a184'];
    const PIN_TONES = ['#cf4a3d', '#3f7fc9', '#4e9a5c', '#8a5cc0', '#c9a24a'];

    const STYLES = ['sticky', 'ruled', 'graph', 'kraft'];
    const ATTACH = ['tape', 'clip', 'pin', 'none'];
    const FONTS = ['ui', 'hand', 'kai', 'round', 'serif', 'sans', 'mono'];
    /** Typeface stacks plus the sizes they read best at; a note may override either. */
    const FONT_META = {
      ui: { stack: 'inherit', base: '13px', lh: '1.62' },
      hand: {
        stack: '"Segoe Print","Bradley Hand","Ink Free","Kaiti SC",KaiTi,STKaiti,"Comic Sans MS",cursive',
        base: '14px',
        lh: '1.55',
      },
      kai: { stack: '"Kaiti SC",KaiTi,STKaiti,"BiauKai","Songti SC","Noto Serif SC",serif', base: '14.5px', lh: '1.62' },
      round: {
        stack: '"Yuanti SC","YouYuan","Hiragino Maru Gothic ProN","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC",sans-serif',
        base: '13.5px',
        lh: '1.6',
      },
      serif: { stack: '"Songti SC",SimSun,"Noto Serif SC","Source Han Serif SC",serif', base: '14px', lh: '1.65' },
      sans: {
        stack: '"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB",sans-serif',
        base: '13px',
        lh: '1.6',
      },
      mono: { stack: 'ui-monospace,"Cascadia Code",Consolas,"SF Mono","Noto Sans Mono",monospace', base: '12.5px', lh: '1.55' },
    };
    const DEFAULT_PREFS = { style: 'sticky', font: 'hand', attach: 'tape', size: 1 };
    /** Style ids from the first two builds, so an existing choice survives. */
    const STYLE_ALIAS = { paper: 'sticky', lined: 'ruled' };
    const SIZES = [132, 168, 202];
    /** Text scale per level: small, medium, large, huge — applied on top of the typeface's own size. */
    const TEXT_SCALES = [0.86, 1, 1.16, 1.36];
    const LEVELS = [0, 1, 2, 3];

    const dicts = {
      en: {
        title: 'Sticky Wall',
        add: 'New note',
        appearance: 'Appearance',
        style: 'Paper',
        font: 'Handwriting',
        attach: 'Fastened with',
        size: 'Text size',
        'size.0': 'S',
        'size.1': 'M',
        'size.2': 'L',
        'size.3': 'XL',
        'note.size': 'Text size',
        'style.sticky': 'Post-it',
        'style.ruled': 'Ruled',
        'style.graph': 'Graph',
        'style.kraft': 'Kraft',
        'attach.tape': 'Tape',
        'attach.clip': 'Clip',
        'attach.pin': 'Pin',
        'attach.none': 'None',
        'font.ui': 'Default',
        'font.hand': 'Hand',
        'font.kai': 'Kai',
        'font.mono': 'Mono',
        'font.short.inherit': 'Wall',
        'font.short.ui': 'UI',
        'font.short.hand': 'Hand',
        'font.short.kai': 'Kai',
        'font.short.round': 'Round',
        'font.short.serif': 'Serif',
        'font.short.sans': 'Sans',
        'font.short.mono': 'Mono',
        'note.text': 'Note text',
        'note.placeholder': 'Write something down…',
        'note.delete': 'Delete note',
        'note.confirmDelete': 'Click again to delete',
        'note.color': 'Note colour',
        'color.amber': 'Amber',
        'color.rose': 'Rose',
        'color.sky': 'Sky',
        'color.mint': 'Mint',
        'color.violet': 'Violet',
        'note.paper': 'Paper colour',
        'note.ink': 'Ink colour',
        'note.font': 'Typeface',
        'font.inherit': 'Wall default',
        'font.round': 'Round',
        'font.serif': 'Serif',
        'font.sans': 'Sans',
        'ink.black': 'Black',
        'ink.blue': 'Blue',
        'ink.red': 'Red',
        'ink.green': 'Green',
        'ink.violet': 'Violet',
        'ink.default': 'Default',
        'empty.title': 'Your wall is empty',
        'empty.hint': 'Jot down a thought — it is kept in this browser and saves itself.',
        'empty.action': 'Write the first note',
        'seed.text': 'Notes save themselves, so there is no save button. Recolour, rewrite or delete them as you like.',
      },
      zh: {
        title: '便签墙',
        add: '新建便签',
        appearance: '外观',
        style: '纸张',
        font: '字体',
        attach: '固定方式',
        size: '字号',
        'size.0': '小',
        'size.1': '中',
        'size.2': '大',
        'size.3': '特大',
        'note.size': '字号',
        'style.sticky': '便利贴',
        'style.ruled': '横线纸',
        'style.graph': '方格纸',
        'style.kraft': '牛皮纸',
        'attach.tape': '胶带',
        'attach.clip': '回形针',
        'attach.pin': '图钉',
        'attach.none': '无',
        'font.ui': '默认',
        'font.hand': '手写',
        'font.kai': '楷体',
        'font.mono': '等宽',
        'font.short.inherit': '整墙',
        'font.short.ui': '默认',
        'font.short.hand': '手',
        'font.short.kai': '楷',
        'font.short.round': '圆',
        'font.short.serif': '宋',
        'font.short.sans': '黑',
        'font.short.mono': '等',
        'note.text': '便签内容',
        'note.placeholder': '写点什么…',
        'note.delete': '删除便签',
        'note.confirmDelete': '再点一次删除',
        'note.color': '便签颜色',
        'color.amber': '琥珀黄',
        'color.rose': '玫瑰粉',
        'color.sky': '天空蓝',
        'color.mint': '薄荷绿',
        'color.violet': '紫罗兰',
        'note.paper': '纸张颜色',
        'note.ink': '墨色',
        'note.font': '字体',
        'font.inherit': '跟随整墙',
        'font.round': '圆体',
        'font.serif': '宋体',
        'font.sans': '黑体',
        'ink.black': '黑',
        'ink.blue': '蓝',
        'ink.red': '红',
        'ink.green': '绿',
        'ink.violet': '紫',
        'ink.default': '默认',
        'empty.title': '墙面还空着',
        'empty.hint': '随手记下一个念头。便签留在本机浏览器里，自动保存。',
        'empty.action': '写下第一条',
        'seed.text': '便签会自动保存，不必找存盘键。换颜色、改文字、删掉，都随你。',
      },
    };

    /** Tiled feTurbulence noise, so grain ships as no image asset. */
    function noise(opacity) {
      return (
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\'%3E' +
        "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E" +
        "%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E" +
        '%3Crect width=\'150\' height=\'150\' filter=\'url(%23n)\' opacity=\'' +
        opacity +
        "'/%3E%3C/svg%3E\")"
      );
    }

    const GRAIN = noise(0.16);
    const WALL_GRAIN = noise(0.05);
    /** Printed ruling, the way a pad comes from the shop. */
    const RULES = 'repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0 25px,rgba(88,106,134,.20) 25px 26px)';
    /** Graph paper: both directions, 16px cells. */
    const GRID =
      'repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0 15px,rgba(88,106,134,.16) 15px 16px),' +
      'repeating-linear-gradient(to right,rgba(0,0,0,0) 0 15px,rgba(88,106,134,.13) 15px 16px)';
    const MARGIN_RULE = 'linear-gradient(90deg,rgba(0,0,0,0) 0 27px,rgba(198,86,86,.34) 27px 28px,rgba(0,0,0,0) 28px)';
    const KRAFT_CREASE =
      'linear-gradient(90deg,rgba(0,0,0,0) 0 31%,rgba(0,0,0,.10) 31.4%,rgba(255,255,255,.22) 32%,rgba(0,0,0,0) 32.6%)';

    /** One rule per typeface; the variables let a single note opt out of the wall default. */
    const FONT_CSS = FONTS.map(
      (id) =>
        '.dw-root[data-font="' +
        id +
        '"]{--dw-ff:' +
        FONT_META[id].stack +
        ';--dw-base:' +
        FONT_META[id].base +
        ';--dw-lh:' +
        FONT_META[id].lh +
        '}',
    );

    const CSS = [
      /* ---- frame ---- */
      '.dw-root{position:relative;height:100%;min-height:0;display:flex;flex-direction:column;',
      'background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}',
      '.dw-head{flex:none;display:flex;align-items:center;gap:9px;padding:13px 20px;',
      'border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.dw-title{font-size:14px;font-weight:600;letter-spacing:.01em}',
      '.dw-count{font-size:11px;line-height:16px;padding:1px 7px;border-radius:999px;',
      'background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}',
      '.dw-grow{flex:1 1 auto}',
      '.dw-add{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 11px;',
      'border:1px solid transparent;border-radius:8px;background:var(--dsw-alias-accent-soft);',
      'color:var(--dsw-alias-accent);font:inherit;font-size:12px;font-weight:600;cursor:pointer;',
      'transition:opacity .12s ease,transform .12s ease}',
      '.dw-add:hover{opacity:.85}',
      '.dw-add:active{transform:scale(.97)}',
      '.dw-add:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-accent)}',
      '.dw-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;',
      'padding:0;border:1px solid transparent;border-radius:8px;background:transparent;',
      'color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background .12s ease,color .12s ease}',
      '.dw-icon:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dw-icon[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-selected);color:var(--dsw-alias-accent)}',
      '.dw-icon:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-accent)}',
      '.dw-appearance{position:relative;display:flex;align-items:center}',
      /* ---- appearance popover ---- */
      '.dw-pop{position:absolute;top:34px;right:0;z-index:30;width:254px;padding:12px 14px 14px;',
      'border-radius:12px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);',
      'box-shadow:0 16px 34px -16px rgba(0,0,0,.5)}',
      '.dw-pop-row{margin-top:11px}',
      '.dw-pop-row:first-child{margin-top:0}',
      '.dw-pop-label{display:block;margin-bottom:5px;font-size:11px;color:var(--dsw-alias-label-tertiary)}',
      '.dw-seg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}',
      '.dw-seg-btn{height:26px;padding:0 2px;border:1px solid transparent;border-radius:7px;',
      'background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}',
      '.dw-seg-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dw-seg-btn[aria-pressed="true"]{background:var(--dsw-alias-accent-soft);color:var(--dsw-alias-accent);font-weight:600}',
      '.dw-seg-btn:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-accent)}',
      /* ---- the wall ---- */
      '.dw-body{flex:1 1 auto;min-height:0;overflow:auto;padding:30px 24px 46px;',
      'background-image:var(--dw-wall,none);background-repeat:repeat}',
      '[data-style="sticky"] .dw-body{--dw-wall:' + WALL_GRAIN + '}',
      '.dw-grid{columns:238px;column-gap:20px}',
      '.dw-note{--dw-tilt:0deg;position:relative;break-inside:avoid;',
      'margin:var(--dw-mt,6px) 0 24px;filter:var(--dw-shadow);transform:rotate(var(--dw-tilt));',
      'transition:transform .18s ease,filter .18s ease}',
      '.dw-note:hover{transform:rotate(calc(var(--dw-tilt) * 0.25)) translateY(-3px);filter:var(--dw-shadow-lift)}',
      '.dw-note:focus-within{transform:rotate(0deg) translateY(-2px);filter:var(--dw-shadow-lift);z-index:4}',
      '.dw-paper{position:relative;display:flex;flex-direction:column;min-height:var(--dw-minh,150px);',
      'padding:14px 14px 10px;border-radius:var(--dw-warp,2px);',
      'background-color:color-mix(in srgb,var(--dw-c) var(--dw-tint,8%),var(--dw-paper));',
      'background-image:var(--dw-tex,none);clip-path:var(--dw-shape)}',
      '.dw-note-text{flex:1 1 auto;width:100%;min-height:0;padding:0;border:0;outline:none;resize:none;',
      'background:transparent;color:var(--dw-ink);font:inherit;',
      'font-family:var(--dw-ff,inherit);',
      'font-size:calc(var(--dw-base,13px) * var(--dw-scale,1));line-height:var(--dw-lh,1.62);',
      'caret-color:var(--dw-ink);overflow:auto;scrollbar-width:thin}',
      '.dw-note-text::placeholder{color:var(--dw-ink-dim);opacity:.5}',
      /* folded corner: the back of the sheet plus a crease */
      '.dw-paper::after{content:"";position:absolute;right:0;bottom:0;width:var(--dw-fold,22px);',
      'height:var(--dw-fold,22px);pointer-events:none;',
      'background:linear-gradient(315deg,var(--dw-fold-fill,rgba(255,255,255,.7)) 0 50%,',
      'rgba(0,0,0,.16) 50% 51.6%,rgba(0,0,0,0) 51.6%)}',
      /* controls stay out of sight until the note is touched */
      '.dw-foot{display:flex;flex-direction:column;gap:7px;margin-top:9px;',
      'padding-right:var(--dw-fold,22px);opacity:0;transition:opacity .16s ease}',
      '.dw-note:hover .dw-foot,.dw-note:focus-within .dw-foot{opacity:1}',
      '@media (hover:none){.dw-foot{opacity:1}}',
      '.dw-foot-row{display:flex;align-items:center;gap:4px;min-width:0}',
      '.dw-stamp{margin-left:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'font-size:10px;color:var(--dw-ink-dim);opacity:.8;',
      'font-family:var(--dsw-font-ui,system-ui,sans-serif);font-variant-numeric:tabular-nums}',
      '.dw-del{display:inline-flex;align-items:center;justify-content:center;width:21px;height:21px;',
      'padding:0;border:0;border-radius:5px;background:transparent;color:var(--dw-ink-dim);',
      'cursor:pointer;opacity:.6;transition:opacity .12s ease,background .12s ease,color .12s ease}',
      '.dw-del:hover{opacity:1;background:rgba(0,0,0,.08);color:#ad3a2e}',
      '.dw-del-armed{opacity:1;color:#ad3a2e;background:rgba(173,58,46,.16)}',
      /* per-note text size stepper, sits beside the bin */
      /* per-note type controls: two small selects, styled to sit on paper */
      '.dw-pick{position:relative;display:inline-flex;align-items:center;min-width:0}',
      '.dw-pick::after{content:"";position:absolute;right:5px;top:50%;margin-top:-1px;',
      'border-left:3px solid transparent;border-right:3px solid transparent;',
      'border-top:4px solid currentColor;opacity:.45;pointer-events:none}',
      '.dw-select{height:22px;padding:0 14px 0 5px;border:1px solid rgba(0,0,0,.16);border-radius:5px;',
      'background:transparent;color:var(--dw-ink);font-family:var(--dsw-font-ui,system-ui,sans-serif);',
      'font-size:10.5px;line-height:20px;cursor:pointer;text-overflow:ellipsis;',
      'appearance:none;-webkit-appearance:none}',
      '.dw-select:hover{background:rgba(0,0,0,.06)}',
      '.dw-select:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dw-c)}',
      '.dw-select option{background:#fffef8;color:#2a2a26}',
      /* a colour chip sits inside the select, so the current colour stays visible */
      '.dw-select-chip{padding-left:18px}',
      '.dw-chip{position:absolute;left:6px;top:50%;transform:translateY(-50%);pointer-events:none}',
      '.dw-chip-paper{width:9px;height:9px;border-radius:50%;background:var(--dw-c);',
      'box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}',
      '.dw-chip-ink{width:6px;height:11px;border-radius:1px;background:var(--dw-ink);opacity:.9}',
      '.dw-select-paper{width:78px}',
      '.dw-select-ink{width:62px}',
      '.dw-select-face{width:60px}',
      '.dw-select-size{width:48px}',
      /* the same control on the theme surface, inside the appearance panel */
      '.dw-pick-pop{display:flex;width:100%}',
      '.dw-pick-pop::after{right:8px;border-top-color:var(--dsw-alias-label-secondary);opacity:.8}',
      '.dw-select-pop{width:100%;height:28px;padding:0 22px 0 8px;border-radius:7px;',
      'border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);',
      'color:var(--dsw-alias-label-primary);font-size:12px;line-height:26px}',
      '.dw-select-pop:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dw-select-pop:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-accent)}',
      '.dw-select-pop option{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary)}',
      /* ---- attachments ---- */
      '.dw-attach{position:absolute;z-index:3;pointer-events:none;transform-origin:50% 0}',
      '.dw-attach svg{display:block}',
      '.dw-tape{top:-11px;left:var(--dw-at-x,32%);width:74px;height:19px;',
      'background:var(--dw-tape);opacity:.5;transform:rotate(var(--dw-at-r,-6deg));',
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 1px 2px rgba(0,0,0,.12);',
      'clip-path:polygon(0 7%,3% 0,96% 2%,100% 9%,99% 93%,96% 100%,4% 98%,1% 91%)}',
      '.dw-tape-b{left:auto;right:10px;transform:rotate(calc(var(--dw-at-r,-6deg) * -1))}',
      '.dw-clip{top:-16px;left:var(--dw-at-x,46%);color:#9aa3ac;',
      'transform:rotate(var(--dw-at-r,6deg));filter:drop-shadow(0 1px 1px rgba(0,0,0,.28))}',
      '.dw-pin{top:-12px;left:var(--dw-at-x,46%);transform:rotate(var(--dw-at-r,0deg));',
      'filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))}',
      /* ---- post-it: saturated stock, no printing ---- */
      '[data-style="sticky"] .dw-paper{--dw-paper:#fffdf0;--dw-ink:#332f26;--dw-ink-dim:#8d8368;',
      '--dw-tint:74%;--dw-warp:1px;--dw-fold:20px;--dw-fold-fill:rgba(255,255,255,.62);',
      '--dw-tex:linear-gradient(168deg,rgba(255,255,255,.42),rgba(255,255,255,0) 46%);',
      '--dw-shadow:drop-shadow(2px 3px 2px rgba(0,0,0,.14)) drop-shadow(4px 11px 16px rgba(0,0,0,.17));',
      '--dw-shadow-lift:drop-shadow(3px 5px 3px rgba(0,0,0,.16)) drop-shadow(6px 18px 22px rgba(0,0,0,.2))}',
      /* ---- ruled pad ---- */
      '[data-style="ruled"] .dw-paper{--dw-paper:#fdfbf3;--dw-ink:#2f3444;--dw-ink-dim:#8b8fa1;',
      '--dw-tint:15%;--dw-warp:2px 3px 2px 2px;--dw-fold:22px;',
      '--dw-tex:' + RULES + ',' + MARGIN_RULE + ';padding-left:38px;background-position:0 9px;',
      '--dw-shadow:drop-shadow(2px 3px 2px rgba(0,0,0,.13)) drop-shadow(3px 9px 14px rgba(0,0,0,.15));',
      '--dw-shadow-lift:drop-shadow(3px 4px 3px rgba(0,0,0,.15)) drop-shadow(5px 16px 20px rgba(0,0,0,.18))}',
      '[data-style="ruled"] .dw-note-text{line-height:26px}',
      /* ---- graph pad ---- */
      '[data-style="graph"] .dw-paper{--dw-paper:#fdfcf7;--dw-ink:#2f3542;--dw-ink-dim:#8b90a0;',
      '--dw-tint:12%;--dw-warp:2px;--dw-fold:20px;',
      '--dw-tex:' + GRID + ',' + GRAIN + ';background-position:0 7px,0 0;',
      '--dw-shadow:drop-shadow(2px 3px 2px rgba(0,0,0,.12)) drop-shadow(3px 9px 14px rgba(0,0,0,.15));',
      '--dw-shadow-lift:drop-shadow(3px 4px 3px rgba(0,0,0,.14)) drop-shadow(5px 16px 20px rgba(0,0,0,.18))}',
      /* ---- kraft ---- */
      '[data-style="kraft"] .dw-paper{--dw-paper:#d9c09c;--dw-ink:#392c1d;--dw-ink-dim:#79643f;',
      '--dw-tint:17%;--dw-warp:2px;--dw-fold:24px;--dw-fold-fill:rgba(255,246,224,.5);',
      '--dw-tex:' + GRAIN + ',' + KRAFT_CREASE + ';',
      '--dw-shadow:drop-shadow(2px 3px 2px rgba(0,0,0,.18)) drop-shadow(3px 9px 14px rgba(0,0,0,.19));',
      '--dw-shadow-lift:drop-shadow(3px 4px 3px rgba(0,0,0,.2)) drop-shadow(5px 16px 20px rgba(0,0,0,.22))}',
      /* ---- typeface per preference; a single note may override the stack inline ---- */
      ...FONT_CSS,
      '[data-style="ruled"] .dw-note-text{line-height:26px}',
      /* ---- empty state ---- */
      '.dw-empty{max-width:352px;margin:7vh auto 0;padding:26px 24px;border-radius:12px;',
      'border:1px dashed var(--dsw-alias-border-l2);text-align:center}',
      '.dw-empty-title{font-size:13px;font-weight:600;margin-bottom:6px}',
      '.dw-empty-hint{font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary)}',
      '.dw-empty .dw-add{margin-top:14px}',
      '@media (prefers-reduced-motion:reduce){.dw-note{transform:none;transition:none}',
      '.dw-note:hover{transform:none}}',
    ].join('');

    function makeId() {
      return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function hashOf(id) {
      let hash = 2166136261;
      for (let i = 0; i < id.length; i += 1) {
        hash ^= id.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }

    function seeded(seed) {
      let state = seed >>> 0;
      return function next() {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    /**
     * A sheet that is not quite a rectangle: each edge bows gently inward, so the
     * silhouette is the one you get from cutting paper by hand, never from a box.
     */
    function paperShape(seed, amplitude) {
      const next = seeded(seed);
      const phase = next() * 6.283;
      const bow = (t) => {
        const value = Math.sin(t * 6.283 * 0.5 + phase) * amplitude;
        return Math.max(0, value);
      };
      const steps = 5;
      const points = [];
      for (let i = 0; i < steps; i += 1) points.push([(i * 100) / (steps - 1), bow(i / (steps - 1))]);
      for (let i = 1; i < steps; i += 1) points.push([100 - bow(i / (steps - 1)), (i * 100) / (steps - 1)]);
      for (let i = steps - 2; i >= 0; i -= 1) points.push([(i * 100) / (steps - 1), 100 - bow(i / (steps - 1))]);
      for (let i = steps - 2; i >= 1; i -= 1) points.push([bow(i / (steps - 1)), (i * 100) / (steps - 1)]);
      const list = points.map((point) => point[0].toFixed(2) + '% ' + point[1].toFixed(2) + '%');
      return 'polygon(' + list.join(',') + ')';
    }

    /** Per-stock geometry: how much it bows, how far it leans, whether it overlaps. */
    const STOCK = {
      sticky: { amplitude: 0.9, tilt: 7, overlap: 18, fold: 20 },
      ruled: { amplitude: 0.5, tilt: 2.4, overlap: 0, fold: 22 },
      graph: { amplitude: 0.5, tilt: 2.6, overlap: 0, fold: 20 },
      kraft: { amplitude: 0.8, tilt: 3.2, overlap: 0, fold: 24 },
    };

    function noteStyle(note, stock) {
      const hash = hashOf(note.id);
      const rand = seeded(hash);
      const tilt = ((rand() * 2 - 1) * stock.tilt).toFixed(2) + 'deg';
      const size = SIZES[Math.floor(rand() * SIZES.length)];
      const fold = Math.round(stock.fold + rand() * 8);
      const atX = 24 + Math.round(rand() * 38);
      const atR = ((rand() * 2 - 1) * 7).toFixed(1) + 'deg';
      const overlap = stock.overlap > 0 && rand() < 0.34 ? -Math.round(rand() * stock.overlap) : 6;
      const tape = TAPE_TONES[(hash >>> 3) % TAPE_TONES.length];
      const pin = PIN_TONES[(hash >>> 5) % PIN_TONES.length];
      const vars = {
        '--dw-c': TONE[note.color] || TONE.amber,
        '--dw-tilt': tilt,
        '--dw-minh': size + 'px',
        '--dw-scale': TEXT_SCALES[note.size] || 1,
        '--dw-shape': paperShape(hash, stock.amplitude),
        '--dw-fold': fold + 'px',
        '--dw-mt': overlap + 'px',
        '--dw-at-x': atX + '%',
        '--dw-at-r': atR,
        '--dw-tape': tape,
        '--dw-pin': pin,
      };
      const face = note.font === null || note.font === undefined ? null : FONT_META[note.font];
      if (face) {
        vars['--dw-ff'] = face.stack;
        vars['--dw-base'] = face.base;
        vars['--dw-lh'] = face.lh;
      }
      return vars;
    }

    /** Compact stamp: today shows a time, other days show a date. */
    function stamp(ts) {
      const date = new Date(ts);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return pad(date.getHours()) + ':' + pad(date.getMinutes());
      }
      const head = date.getFullYear() === now.getFullYear() ? '' : date.getFullYear() + '/';
      return head + (date.getMonth() + 1) + '/' + date.getDate();
    }

    function normalizeNotes(parsed, defaultSize) {
      const list = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.notes) ? parsed.notes : null;
      if (list === null) return null;
      const notes = [];
      for (const entry of list) {
        if (!entry || typeof entry !== 'object') continue;
        if (typeof entry.text !== 'string') continue;
        notes.push({
          id: typeof entry.id === 'string' && entry.id !== '' ? entry.id : makeId(),
          text: entry.text,
          color: COLORS.indexOf(entry.color) >= 0 ? entry.color : 'amber',
          ink: INK_IDS.indexOf(entry.ink) >= 0 ? entry.ink : null,
          font: FONTS.indexOf(entry.font) >= 0 ? entry.font : null,
          size: LEVELS.indexOf(entry.size) >= 0 ? entry.size : defaultSize,
          updatedAt: typeof entry.updatedAt === 'number' && isFinite(entry.updatedAt) ? entry.updatedAt : Date.now(),
        });
      }
      return notes;
    }

    function readNotes(defaultSize) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        return normalizeNotes(JSON.parse(raw), defaultSize);
      } catch (error) {
        return null;
      }
    }

    function writeNotes(notes) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes }));
      } catch (error) {
        /* A full or blocked storage must never break the wall itself. */
      }
    }

    function readPrefs() {
      const fallback = {
        style: DEFAULT_PREFS.style,
        font: DEFAULT_PREFS.font,
        attach: DEFAULT_PREFS.attach,
        size: DEFAULT_PREFS.size,
      };
      try {
        const raw = window.localStorage.getItem(PREFS_KEY);
        if (raw === null) return fallback;
        const value = JSON.parse(raw) || {};
        const style = STYLE_ALIAS[value.style] || value.style;
        return {
          style: STYLES.indexOf(style) >= 0 ? style : fallback.style,
          font: FONTS.indexOf(value.font) >= 0 ? value.font : fallback.font,
          attach: ATTACH.indexOf(value.attach) >= 0 ? value.attach : fallback.attach,
          size: LEVELS.indexOf(value.size) >= 0 ? value.size : fallback.size,
        };
      } catch (error) {
        return fallback;
      }
    }

    function writePrefs(prefs) {
      try {
        window.localStorage.setItem(
          PREFS_KEY,
          JSON.stringify({
            version: 2,
            style: prefs.style,
            font: prefs.font,
            attach: prefs.attach,
            size: prefs.size,
          }),
        );
      } catch (error) {
        /* Preference persistence is best effort. */
      }
    }

    function fallbackT(key) {
      const dict = dicts.zh;
      return typeof dict[key] === 'string' ? dict[key] : key;
    }

    function plusIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 13, height: 13, 'aria-hidden': true, fill: 'none' },
        h('path', { d: 'M8 3.4v9.2M3.4 8h9.2', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
      );
    }

    function slidersIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': true, fill: 'none' },
        h('path', { d: 'M2.4 4.6h11.2M2.4 11.4h11.2', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('circle', { cx: 6, cy: 4.6, r: 1.9, fill: 'var(--dsw-alias-bg-base)', stroke: 'currentColor', strokeWidth: 1.4 }),
        h('circle', { cx: 10.4, cy: 11.4, r: 1.9, fill: 'var(--dsw-alias-bg-base)', stroke: 'currentColor', strokeWidth: 1.4 }),
      );
    }

    function trashIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 13, height: 13, 'aria-hidden': true, fill: 'none' },
        h('path', {
          d: 'M2.6 4.6h10.8M6.1 4.4V3.1h3.8v1.3M4.4 4.6l.6 8.1a1.1 1.1 0 0 0 1.1 1h3.8a1.1 1.1 0 0 0 1.1-1l.6-8.1',
          stroke: 'currentColor',
          strokeWidth: 1.3,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /** Bent wire, hanging over the top edge. */
    function clipIcon() {
      return h(
        'svg',
        { viewBox: '0 0 20 46', width: 16, height: 36, 'aria-hidden': true, fill: 'none' },
        h('path', {
          d: 'M5.6 15.5v21a4.4 4.4 0 0 0 8.8 0V11a3.2 3.2 0 0 0-6.4 0v24a2 2 0 0 0 4 0V15.5',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /** Round-headed thumb tack. */
    function pinIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 26', width: 19, height: 21, 'aria-hidden': true },
        h('path', { d: 'M12 14.6v10.2', stroke: '#8d8d8d', strokeWidth: 1.8, strokeLinecap: 'round' }),
        h('circle', { cx: 12, cy: 8.4, r: 7.2, fill: 'var(--dw-pin)' }),
        h('circle', { cx: 9.4, cy: 5.8, r: 2.5, fill: 'rgba(255,255,255,.55)' }),
      );
    }

    function Attachment(props) {
      if (props.kind === 'none') return null;
      if (props.kind === 'clip') {
        return h('span', { className: 'dw-attach dw-clip', 'aria-hidden': true }, clipIcon());
      }
      if (props.kind === 'pin') {
        return h('span', { className: 'dw-attach dw-pin', 'aria-hidden': true }, pinIcon());
      }
      return h(
        React.Fragment,
        null,
        h('span', { className: 'dw-attach dw-tape', 'aria-hidden': true }),
        props.double ? h('span', { className: 'dw-attach dw-tape dw-tape-b', 'aria-hidden': true }) : null,
      );
    }

    function Note(props) {
      const { note, t, armed, focus, attach, stock, onText, onColor, onInk, onFont, onSize, onDelete } = props;
      const area = useRef(null);
      const style = noteStyle(note, stock);
      const doubleTape = hashOf(note.id) % 4 === 0;
      const ink = note.ink ? INK.find((item) => item.id === note.ink) : null;
      const paperStyle = ink
        ? { '--dw-ink': ink.hex, '--dw-ink-dim': 'color-mix(in srgb,' + ink.hex + ' 58%,transparent)' }
        : undefined;

      useEffect(() => {
        if (!focus || area.current === null) return;
        area.current.focus();
        const end = area.current.value.length;
        area.current.setSelectionRange(end, end);
      }, [focus]);

      return h(
        'div',
        { className: 'dw-note', style },
        h(Attachment, { kind: attach, double: doubleTape }),
        h(
          'div',
          { className: 'dw-paper', style: paperStyle },
          h('textarea', {
            ref: area,
            className: 'dw-note-text',
            value: note.text,
            rows: 3,
            spellCheck: false,
            placeholder: t('note.placeholder'),
            'aria-label': t('note.text'),
            onChange: (event) => onText(note.id, event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Escape') event.currentTarget.blur();
            },
          }),
          h(
            'div',
            { className: 'dw-foot' },
            h(
              'div',
              { className: 'dw-foot-row' },
              h(
                'span',
                { className: 'dw-pick' },
                h('span', { className: 'dw-chip dw-chip-paper', 'aria-hidden': true }),
                h(
                  'select',
                  {
                    className: 'dw-select dw-select-chip dw-select-paper',
                    value: note.color,
                    title: t('note.paper'),
                    'aria-label': t('note.paper'),
                    onChange: (event) => onColor(note.id, event.target.value),
                  },
                  COLORS.map((color) => h('option', { key: color, value: color }, t('color.' + color))),
                ),
              ),
              h(
                'span',
                { className: 'dw-pick' },
                h('span', { className: 'dw-chip dw-chip-ink', 'aria-hidden': true }),
                h(
                  'select',
                  {
                    className: 'dw-select dw-select-chip dw-select-ink',
                    value: note.ink === null || note.ink === undefined ? '' : note.ink,
                    title: t('note.ink'),
                    'aria-label': t('note.ink'),
                    onChange: (event) => onInk(note.id, event.target.value === '' ? null : event.target.value),
                  },
                  h('option', { value: '' }, t('ink.default')),
                  INK.map((item) => h('option', { key: item.id, value: item.id }, t('ink.' + item.id))),
                ),
              ),
            ),
            h(
              'div',
              { className: 'dw-foot-row' },
              h(
                'span',
                { className: 'dw-pick' },
                h(
                  'select',
                  {
                    className: 'dw-select dw-select-face',
                    value: note.font === null || note.font === undefined ? '' : note.font,
                    title: t('note.font'),
                    'aria-label': t('note.font'),
                    onChange: (event) => onFont(note.id, event.target.value === '' ? null : event.target.value),
                  },
                  h('option', { value: '' }, t('font.short.inherit')),
                  FONTS.map((font) => h('option', { key: font, value: font }, t('font.short.' + font))),
                ),
              ),
              h(
                'span',
                { className: 'dw-pick' },
                h(
                  'select',
                  {
                    className: 'dw-select dw-select-size',
                    value: String(note.size === undefined ? 1 : note.size),
                    title: t('note.size'),
                    'aria-label': t('note.size'),
                    onChange: (event) => onSize(note.id, Number(event.target.value)),
                  },
                  LEVELS.map((level) => h('option', { key: level, value: String(level) }, t('size.' + level))),
                ),
              ),
              h('span', { className: 'dw-stamp', title: new Date(note.updatedAt).toLocaleString() }, stamp(note.updatedAt)),
              h(
                'button',
                {
                  type: 'button',
                  className: armed ? 'dw-del dw-del-armed' : 'dw-del',
                  title: armed ? t('note.confirmDelete') : t('note.delete'),
                  'aria-label': armed ? t('note.confirmDelete') : t('note.delete'),
                  onClick: () => onDelete(note),
                },
                trashIcon(),
              ),
            ),
          ),
        ),
      );
    }

    function SelectRow(props) {
      return h(
        'div',
        { className: 'dw-pop-row' },
        h('span', { className: 'dw-pop-label' }, props.label),
        h(
          'span',
          { className: 'dw-pick dw-pick-pop' },
          h(
            'select',
            {
              className: 'dw-select dw-select-pop',
              value: props.value,
              'aria-label': props.label,
              onChange: (event) => props.onPick(event.target.value),
            },
            props.options.map((option) => h('option', { key: option.value, value: option.value }, option.label)),
          ),
        ),
      );
    }

    function OptionRow(props) {
      return h(
        'div',
        { className: 'dw-pop-row' },
        h('span', { className: 'dw-pop-label' }, props.label),
        h(
          'div',
          { className: 'dw-seg' },
          props.values.map((value) =>
            h(
              'button',
              {
                key: value,
                type: 'button',
                className: 'dw-seg-btn',
                'aria-pressed': props.current === value,
                onClick: () => props.onPick(value),
              },
              props.t(props.prefix + value),
            ),
          ),
        ),
      );
    }

    function StickyWall(props) {
      const t = typeof props.t === 'function' ? props.t : fallbackT;
      const [prefs, setPrefs] = useState(readPrefs);
      const [notes, setNotes] = useState(() => {
        const stored = readNotes(prefs.size);
        if (stored !== null) return stored;
        return [{ id: makeId(), text: t('seed.text'), color: 'amber', size: prefs.size, updatedAt: Date.now() }];
      });
      const [openPrefs, setOpenPrefs] = useState(false);
      const [draftId, setDraftId] = useState(null);
      const [armedId, setArmedId] = useState(null);
      const appearance = useRef(null);

      useEffect(() => {
        writeNotes(notes);
      }, [notes]);

      useEffect(() => {
        writePrefs(prefs);
      }, [prefs]);

      useEffect(() => {
        if (!openPrefs) return;
        const onDown = (event) => {
          const box = appearance.current;
          if (box !== null && !box.contains(event.target)) setOpenPrefs(false);
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setOpenPrefs(false);
        };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
          document.removeEventListener('pointerdown', onDown);
          document.removeEventListener('keydown', onKey);
        };
      }, [openPrefs]);

      function addNote() {
        const id = makeId();
        setNotes((prev) => [
          {
            id,
            text: '',
            color: COLORS[prev.length % COLORS.length],
            ink: null,
            font: null,
            size: prefs.size,
            updatedAt: Date.now(),
          },
          ...prev,
        ]);
        setDraftId(id);
      }

      function editText(id, text) {
        setNotes((prev) =>
          prev.map((note) => (note.id === id ? { ...note, text, updatedAt: Date.now() } : note)),
        );
      }

      function recolor(id, color) {
        setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, color } : note)));
      }

      function setInk(id, ink) {
        setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ink } : note)));
      }

      /** One note's typeface; null means it follows the wall. */
      function setNoteFont(id, font) {
        setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, font } : note)));
      }

      function setNoteSize(id, size) {
        setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, size } : note)));
      }

      /** A wall-wide size resets every sheet, so nothing is stranded at an old step. */
      function applySizeToWall(index) {
        setPrefs((prev) => ({ ...prev, size: index }));
        setNotes((prev) => prev.map((note) => ({ ...note, size: index })));
      }

      function remove(id) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        setArmedId(null);
        setDraftId((current) => (current === id ? null : current));
      }

      function requestDelete(note) {
        if (armedId === note.id || note.text.trim() === '') {
          remove(note.id);
          return;
        }
        setArmedId(note.id);
      }

      const empty = notes.length === 0;
      const stock = STOCK[prefs.style] || STOCK.sticky;

      return h(
        'div',
        {
          className: 'dw-root',
          role: 'region',
          'aria-label': t('title'),
          'data-style': prefs.style,
          'data-font': prefs.font,
        },
        h('style', null, CSS),
        h(
          'div',
          { className: 'dw-head' },
          h('span', { className: 'dw-title' }, t('title')),
          empty ? null : h('span', { className: 'dw-count' }, String(notes.length)),
          h('span', { className: 'dw-grow' }),
          h(
            'div',
            { className: 'dw-appearance', ref: appearance },
            h(
              'button',
              {
                type: 'button',
                className: 'dw-icon',
                title: t('appearance'),
                'aria-label': t('appearance'),
                'aria-expanded': openPrefs,
                'aria-haspopup': 'true',
                onClick: () => setOpenPrefs((open) => !open),
              },
              slidersIcon(),
            ),
            openPrefs
              ? h(
                  'div',
                  { className: 'dw-pop', role: 'group', 'aria-label': t('appearance') },
                  h(OptionRow, {
                    label: t('style'),
                    prefix: 'style.',
                    values: STYLES,
                    current: prefs.style,
                    t,
                    onPick: (style) => setPrefs((prev) => ({ ...prev, style })),
                  }),
                  h(SelectRow, {
                    label: t('font'),
                    value: prefs.font,
                    options: FONTS.map((font) => ({ value: font, label: t('font.' + font) })),
                    onPick: (font) => setPrefs((prev) => ({ ...prev, font })),
                  }),
                  h(SelectRow, {
                    label: t('size'),
                    value: String(prefs.size),
                    options: LEVELS.map((level) => ({ value: String(level), label: t('size.' + level) })),
                    onPick: (value) => applySizeToWall(Number(value)),
                  }),
                  h(OptionRow, {
                    label: t('attach'),
                    prefix: 'attach.',
                    values: ATTACH,
                    current: prefs.attach,
                    t,
                    onPick: (attach) => setPrefs((prev) => ({ ...prev, attach })),
                  }),
                )
              : null,
          ),
          h('button', { type: 'button', className: 'dw-add', onClick: addNote }, plusIcon(), h('span', null, t('add'))),
        ),
        h(
          'div',
          { className: 'dw-body' },
          empty
            ? h(
                'div',
                { className: 'dw-empty' },
                h('div', { className: 'dw-empty-title' }, t('empty.title')),
                h('div', { className: 'dw-empty-hint' }, t('empty.hint')),
                h(
                  'button',
                  { type: 'button', className: 'dw-add', onClick: addNote },
                  plusIcon(),
                  h('span', null, t('empty.action')),
                ),
              )
            : h(
                'div',
                { className: 'dw-grid' },
                notes.map((note) =>
                  h(Note, {
                    key: note.id,
                    note,
                    t,
                    armed: armedId === note.id,
                    focus: draftId === note.id,
                    attach: prefs.attach,
                    stock,
                    onText: editText,
                    onColor: recolor,
                    onInk: setInk,
                    onFont: setNoteFont,
                    onSize: setNoteSize,
                    onDelete: requestDelete,
                  }),
                ),
              ),
        ),
      );
    }

    /** Sidebar icon: the button itself is drawn by the sidebar owner. */
    function PanelIcon(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 18;
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: size,
          height: size,
          'aria-hidden': true,
          fill: 'none',
          style: { display: 'block' },
        },
        h('path', {
          d: 'M14.9 3.9H7.3a1.9 1.9 0 0 0-1.9 1.9v12.3a1.9 1.9 0 0 0 1.9 1.9h9.4a1.9 1.9 0 0 0 1.9-1.9V8.4z',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M14.9 3.9v3a1.4 1.4 0 0 0 1.4 1.4h2.3',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinejoin: 'round',
          opacity: 0.7,
        }),
        h('path', {
          d: 'M8.7 12.1h6.6M8.7 15.3h4.5',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          opacity: 0.8,
        }),
      );
    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      ctx.effect(() => {
        const disposers = [
          ctx.locale.register(NS, 'en', dicts.en),
          ctx.locale.register(NS, 'zh', dicts.zh),
        ];
        return () => {
          for (const dispose of disposers) {
            try {
              dispose();
            } catch (error) {
              /* A half-torn-down locale registry must not break unload. */
            }
          }
        };
      }, 'sticky-wall: dictionaries');

      ctx.slots.inject('main', () =>
        ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, StickyWall),
      );

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 30,
            label: () => ctx.locale.bind(NS)('title'),
            locale: NS,
          },
          PanelIcon,
        ),
      );
    }

    return { inject, apply };
  },
});
