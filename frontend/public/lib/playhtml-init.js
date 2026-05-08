var ln = 1e6, qc = "y-pk-batch", Gr = !1, De = (e, t) => {
  if (e.byteLength <= ln) {
    t.send(e);
    return;
  }
  Gr || (console.warn(
    "[y-partykit]",
    "The Y.js update size exceeds 1MB, which is the maximum size for an individual update. The update will be split into chunks. This is an experimental feature.",
    `Message size: ${(e.byteLength / 1e3 / 1e3).toFixed(1)}MB`
  ), Gr = !0);
  const n = (Date.now() + Math.random()).toString(36).substring(10), s = Math.ceil(e.byteLength / ln);
  t.send(
    Wr({
      id: n,
      type: "start",
      size: e.byteLength,
      count: s
    })
  );
  let r = 0, i = 0;
  for (let o = 0; o < s; o++) {
    const c = e.slice(ln * o, ln * (o + 1));
    t.send(c), i += 1, r += c.byteLength;
  }
  t.send(
    Wr({
      id: n,
      type: "end",
      size: r,
      count: i
    })
  );
};
function Wr(e) {
  return `${qc}#${JSON.stringify(e)}`;
}
const tt = () => /* @__PURE__ */ new Map(), ks = (e) => {
  const t = tt();
  return e.forEach((n, s) => {
    t.set(s, n);
  }), t;
}, Dt = (e, t, n) => {
  let s = e.get(t);
  return s === void 0 && e.set(t, s = n()), s;
}, Qc = (e, t) => {
  const n = [];
  for (const [s, r] of e)
    n.push(t(r, s));
  return n;
}, tl = (e, t) => {
  for (const [n, s] of e)
    if (t(s, n))
      return !0;
  return !1;
}, zt = () => /* @__PURE__ */ new Set(), hs = (e) => e[e.length - 1], el = (e, t) => {
  for (let n = 0; n < t.length; n++)
    e.push(t[n]);
}, It = Array.from, qs = (e, t) => {
  for (let n = 0; n < e.length; n++)
    if (!t(e[n], n, e))
      return !1;
  return !0;
}, Ji = (e, t) => {
  for (let n = 0; n < e.length; n++)
    if (t(e[n], n, e))
      return !0;
  return !1;
}, nl = (e, t) => {
  const n = new Array(e);
  for (let s = 0; s < e; s++)
    n[s] = t(s, n);
  return n;
}, Bn = Array.isArray, Zi = String.fromCharCode, sl = (e) => e.toLowerCase(), rl = /^\s*/g, il = (e) => e.replace(rl, ""), ol = /([A-Z])/g, Xr = (e, t) => il(e.replace(ol, (n) => `${t}${sl(n)}`)), cl = (e) => {
  const t = unescape(encodeURIComponent(e)), n = t.length, s = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    s[r] = /** @type {number} */
    t.codePointAt(r);
  return s;
}, Te = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), ll = (e) => Te.encode(e), al = Te ? ll : cl;
let _e = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
_e && _e.decode(new Uint8Array()).length === 1 && (_e = null);
const hl = (e, t) => nl(t, () => e).join(""), Jr = (e) => e === void 0 ? null : e;
class ul {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(t, n) {
    this.map.set(t, n);
  }
  /**
   * @param {string} key
   */
  getItem(t) {
    return this.map.get(t);
  }
}
let qi = new ul(), Qs = !0;
try {
  typeof localStorage < "u" && localStorage && (qi = localStorage, Qs = !1);
} catch {
}
const Qi = qi, dl = (e) => Qs || addEventListener(
  "storage",
  /** @type {any} */
  e
), fl = (e) => Qs || removeEventListener(
  "storage",
  /** @type {any} */
  e
), Oe = /* @__PURE__ */ Symbol("Equality"), to = (e, t) => e === t || !!e?.[Oe]?.(t) || !1, pl = (e) => typeof e == "object", gl = Object.assign, yl = Object.keys, ml = (e, t) => {
  for (const n in e)
    t(e[n], n);
}, wl = (e, t) => {
  const n = [];
  for (const s in e)
    n.push(t(e[s], s));
  return n;
}, An = (e) => yl(e).length, bl = (e) => {
  for (const t in e)
    return !1;
  return !0;
}, We = (e, t) => {
  for (const n in e)
    if (!t(e[n], n))
      return !1;
  return !0;
}, tr = (e, t) => Object.prototype.hasOwnProperty.call(e, t), xl = (e, t) => e === t || An(e) === An(t) && We(e, (n, s) => (n !== void 0 || tr(t, s)) && to(t[s], n)), er = (e, t, n = 0) => {
  try {
    for (; n < e.length; n++)
      e[n](...t);
  } finally {
    n < e.length && er(e, t, n + 1);
  }
}, Cl = (e) => e, ce = (e, t) => {
  if (e === t)
    return !0;
  if (e == null || t == null || e.constructor !== t.constructor && (e.constructor || Object) !== (t.constructor || Object))
    return !1;
  if (e[Oe] != null)
    return e[Oe](t);
  switch (e.constructor) {
    case ArrayBuffer:
      e = new Uint8Array(e), t = new Uint8Array(t);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (e.byteLength !== t.byteLength)
        return !1;
      for (let n = 0; n < e.length; n++)
        if (e[n] !== t[n])
          return !1;
      break;
    }
    case Set: {
      if (e.size !== t.size)
        return !1;
      for (const n of e)
        if (!t.has(n))
          return !1;
      break;
    }
    case Map: {
      if (e.size !== t.size)
        return !1;
      for (const n of e.keys())
        if (!t.has(n) || !ce(e.get(n), t.get(n)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (An(e) !== An(t))
        return !1;
      for (const n in e)
        if (!tr(e, n) || !ce(e[n], t[n]))
          return !1;
      break;
    case Array:
      if (e.length !== t.length)
        return !1;
      for (let n = 0; n < e.length; n++)
        if (!ce(e[n], t[n]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, vl = (e, t) => t.includes(e), de = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", eo = typeof window < "u" && typeof document < "u" && !de;
let wt;
const Al = () => {
  if (wt === void 0)
    if (de) {
      wt = tt();
      const e = process.argv;
      let t = null;
      for (let n = 0; n < e.length; n++) {
        const s = e[n];
        s[0] === "-" ? (t !== null && wt.set(t, ""), t = s) : t !== null && (wt.set(t, s), t = null);
      }
      t !== null && wt.set(t, "");
    } else typeof location == "object" ? (wt = tt(), (location.search || "?").slice(1).split("&").forEach((e) => {
      if (e.length !== 0) {
        const [t, n] = e.split("=");
        wt.set(`--${Xr(t, "-")}`, n), wt.set(`-${Xr(t, "-")}`, n);
      }
    })) : wt = tt();
  return wt;
}, Ds = (e) => Al().has(e), _s = (e) => Jr(de ? process.env[e.toUpperCase().replaceAll("-", "_")] : Qi.getItem(e)), no = (e) => Ds("--" + e) || _s(e) !== null, Sl = no("production"), El = de && vl(process.env.FORCE_COLOR, ["true", "1", "2"]), kl = El || !Ds("--no-colors") && // @todo deprecate --no-colors
!no("no-color") && (!de || process.stdout.isTTY) && (!de || Ds("--color") || _s("COLORTERM") !== null || (_s("TERM") || "").includes("color")), gt = Math.floor, wn = Math.abs, nr = (e, t) => e < t ? e : t, ee = (e, t) => e > t ? e : t, Dl = Math.pow, so = (e) => e !== 0 ? e < 0 : 1 / e < 0, Zr = 1, qr = 2, us = 4, ds = 8, Re = 32, Mt = 64, st = 128, jn = 31, Ms = 63, Yt = 127, _l = 2147483647, Sn = Number.MAX_SAFE_INTEGER, Qr = Number.MIN_SAFE_INTEGER, Ml = Number.isInteger || ((e) => typeof e == "number" && isFinite(e) && gt(e) === e);
class Xe {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const q = () => new Xe(), sr = (e) => {
  let t = e.cpos;
  for (let n = 0; n < e.bufs.length; n++)
    t += e.bufs[n].length;
  return t;
}, R = (e) => {
  const t = new Uint8Array(sr(e));
  let n = 0;
  for (let s = 0; s < e.bufs.length; s++) {
    const r = e.bufs[s];
    t.set(r, n), n += r.length;
  }
  return t.set(new Uint8Array(e.cbuf.buffer, 0, e.cpos), n), t;
}, Il = (e, t) => {
  const n = e.cbuf.length;
  n - e.cpos < t && (e.bufs.push(new Uint8Array(e.cbuf.buffer, 0, e.cpos)), e.cbuf = new Uint8Array(ee(n, t) * 2), e.cpos = 0);
}, $ = (e, t) => {
  const n = e.cbuf.length;
  e.cpos === n && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(n * 2), e.cpos = 0), e.cbuf[e.cpos++] = t;
}, Is = $, b = (e, t) => {
  for (; t > Yt; )
    $(e, st | Yt & t), t = gt(t / 128);
  $(e, Yt & t);
}, rr = (e, t) => {
  const n = so(t);
  for (n && (t = -t), $(e, (t > Ms ? st : 0) | (n ? Mt : 0) | Ms & t), t = gt(t / 64); t > 0; )
    $(e, (t > Yt ? st : 0) | Yt & t), t = gt(t / 128);
}, Ls = new Uint8Array(3e4), Ll = Ls.length / 3, Tl = (e, t) => {
  if (t.length < Ll) {
    const n = Te.encodeInto(t, Ls).written || 0;
    b(e, n);
    for (let s = 0; s < n; s++)
      $(e, Ls[s]);
  } else
    B(e, al(t));
}, Ol = (e, t) => {
  const n = unescape(encodeURIComponent(t)), s = n.length;
  b(e, s);
  for (let r = 0; r < s; r++)
    $(
      e,
      /** @type {number} */
      n.codePointAt(r)
    );
}, Kt = Te && /** @type {any} */
Te.encodeInto ? Tl : Ol, zn = (e, t) => {
  const n = e.cbuf.length, s = e.cpos, r = nr(n - s, t.length), i = t.length - r;
  e.cbuf.set(t.subarray(0, r), s), e.cpos += r, i > 0 && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(ee(n * 2, i)), e.cbuf.set(t.subarray(r)), e.cpos = i);
}, B = (e, t) => {
  b(e, t.byteLength), zn(e, t);
}, ir = (e, t) => {
  Il(e, t);
  const n = new DataView(e.cbuf.buffer, e.cpos, t);
  return e.cpos += t, n;
}, Rl = (e, t) => ir(e, 4).setFloat32(0, t, !1), Nl = (e, t) => ir(e, 8).setFloat64(0, t, !1), Ul = (e, t) => (
  /** @type {any} */
  ir(e, 8).setBigInt64(0, t, !1)
), ti = new DataView(new ArrayBuffer(4)), Pl = (e) => (ti.setFloat32(0, e), ti.getFloat32(0) === e), Ne = (e, t) => {
  switch (typeof t) {
    case "string":
      $(e, 119), Kt(e, t);
      break;
    case "number":
      Ml(t) && wn(t) <= _l ? ($(e, 125), rr(e, t)) : Pl(t) ? ($(e, 124), Rl(e, t)) : ($(e, 123), Nl(e, t));
      break;
    case "bigint":
      $(e, 122), Ul(e, t);
      break;
    case "object":
      if (t === null)
        $(e, 126);
      else if (Bn(t)) {
        $(e, 117), b(e, t.length);
        for (let n = 0; n < t.length; n++)
          Ne(e, t[n]);
      } else if (t instanceof Uint8Array)
        $(e, 116), B(e, t);
      else {
        $(e, 118);
        const n = Object.keys(t);
        b(e, n.length);
        for (let s = 0; s < n.length; s++) {
          const r = n[s];
          Kt(e, r), Ne(e, t[r]);
        }
      }
      break;
    case "boolean":
      $(e, t ? 120 : 121);
      break;
    default:
      $(e, 127);
  }
};
class ei extends Xe {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(t) {
    super(), this.w = t, this.s = null, this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(t) {
    this.s === t ? this.count++ : (this.count > 0 && b(this, this.count - 1), this.count = 1, this.w(this, t), this.s = t);
  }
}
const ni = (e) => {
  e.count > 0 && (rr(e.encoder, e.count === 1 ? e.s : -e.s), e.count > 1 && b(e.encoder, e.count - 2));
};
class bn {
  constructor() {
    this.encoder = new Xe(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.s === t ? this.count++ : (ni(this), this.count = 1, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return ni(this), R(this.encoder);
  }
}
const si = (e) => {
  if (e.count > 0) {
    const t = e.diff * 2 + (e.count === 1 ? 0 : 1);
    rr(e.encoder, t), e.count > 1 && b(e.encoder, e.count - 2);
  }
};
class fs {
  constructor() {
    this.encoder = new Xe(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(t) {
    this.diff === t - this.s ? (this.s = t, this.count++) : (si(this), this.count = 1, this.diff = t - this.s, this.s = t);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return si(this), R(this.encoder);
  }
}
class Bl {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new bn();
  }
  /**
   * @param {string} string
   */
  write(t) {
    this.s += t, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(t.length);
  }
  toUint8Array() {
    const t = new Xe();
    return this.sarr.push(this.s), this.s = "", Kt(t, this.sarr.join("")), zn(t, this.lensE.toUint8Array()), R(t);
  }
}
const vt = (e) => new Error(e), pt = () => {
  throw vt("Method unimplemented");
}, ut = () => {
  throw vt("Unexpected case");
}, ro = vt("Unexpected end of array"), io = vt("Integer out of Range");
class Fn {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(t) {
    this.arr = t, this.pos = 0;
  }
}
const Ht = (e) => new Fn(e), jl = (e) => e.pos !== e.arr.length, zl = (e, t) => {
  const n = new Uint8Array(e.arr.buffer, e.pos + e.arr.byteOffset, t);
  return e.pos += t, n;
}, Z = (e) => zl(e, A(e)), fe = (e) => e.arr[e.pos++], A = (e) => {
  let t = 0, n = 1;
  const s = e.arr.length;
  for (; e.pos < s; ) {
    const r = e.arr[e.pos++];
    if (t = t + (r & Yt) * n, n *= 128, r < st)
      return t;
    if (t > Sn)
      throw io;
  }
  throw ro;
}, or = (e) => {
  let t = e.arr[e.pos++], n = t & Ms, s = 64;
  const r = (t & Mt) > 0 ? -1 : 1;
  if ((t & st) === 0)
    return r * n;
  const i = e.arr.length;
  for (; e.pos < i; ) {
    if (t = e.arr[e.pos++], n = n + (t & Yt) * s, s *= 128, t < st)
      return r * n;
    if (n > Sn)
      throw io;
  }
  throw ro;
}, Fl = (e) => {
  let t = A(e);
  if (t === 0)
    return "";
  {
    let n = String.fromCodePoint(fe(e));
    if (--t < 100)
      for (; t--; )
        n += String.fromCodePoint(fe(e));
    else
      for (; t > 0; ) {
        const s = t < 1e4 ? t : 1e4, r = e.arr.subarray(e.pos, e.pos + s);
        e.pos += s, n += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          r
        ), t -= s;
      }
    return decodeURIComponent(escape(n));
  }
}, Hl = (e) => (
  /** @type any */
  _e.decode(Z(e))
), jt = _e ? Hl : Fl, cr = (e, t) => {
  const n = new DataView(e.arr.buffer, e.arr.byteOffset + e.pos, t);
  return e.pos += t, n;
}, Vl = (e) => cr(e, 4).getFloat32(0, !1), $l = (e) => cr(e, 8).getFloat64(0, !1), Yl = (e) => (
  /** @type {any} */
  cr(e, 8).getBigInt64(0, !1)
), Kl = [
  (e) => {
  },
  // CASE 127: undefined
  (e) => null,
  // CASE 126: null
  or,
  // CASE 125: integer
  Vl,
  // CASE 124: float32
  $l,
  // CASE 123: float64
  Yl,
  // CASE 122: bigint
  (e) => !1,
  // CASE 121: boolean (false)
  (e) => !0,
  // CASE 120: boolean (true)
  jt,
  // CASE 119: string
  (e) => {
    const t = A(e), n = {};
    for (let s = 0; s < t; s++) {
      const r = jt(e);
      n[r] = Ue(e);
    }
    return n;
  },
  (e) => {
    const t = A(e), n = [];
    for (let s = 0; s < t; s++)
      n.push(Ue(e));
    return n;
  },
  Z
  // CASE 116: Uint8Array
], Ue = (e) => Kl[127 - fe(e)](e);
class ri extends Fn {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(t, n) {
    super(t), this.reader = n, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), jl(this) ? this.count = A(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class xn extends Fn {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    super(t), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = or(this);
      const t = so(this.s);
      this.count = 1, t && (this.s = -this.s, this.count = A(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class ps extends Fn {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    super(t), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const t = or(this), n = t & 1;
      this.diff = gt(t / 2), this.count = 1, n && (this.count = A(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class Gl {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(t) {
    this.decoder = new xn(t), this.str = jt(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const t = this.spos + this.decoder.read(), n = this.str.slice(this.spos, t);
    return this.spos = t, n;
  }
}
const oo = (e) => new Uint8Array(e), Wl = (e, t, n) => new Uint8Array(e, t, n), Xl = (e) => new Uint8Array(e), Jl = (e) => {
  let t = "";
  for (let n = 0; n < e.byteLength; n++)
    t += Zi(e[n]);
  return btoa(t);
}, Zl = (e) => Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64"), ql = (e) => {
  const t = atob(e), n = oo(t.length);
  for (let s = 0; s < t.length; s++)
    n[s] = t.charCodeAt(s);
  return n;
}, Ql = (e) => {
  const t = Buffer.from(e, "base64");
  return Wl(t.buffer, t.byteOffset, t.byteLength);
}, ta = eo ? Jl : Zl, ea = eo ? ql : Ql, na = (e) => {
  const t = oo(e.byteLength);
  return t.set(e), t;
}, co = /* @__PURE__ */ new Map();
class sa {
  /**
   * @param {string} room
   */
  constructor(t) {
    this.room = t, this.onmessage = null, this._onChange = (n) => n.key === t && this.onmessage !== null && this.onmessage({ data: ea(n.newValue || "") }), dl(this._onChange);
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(t) {
    Qi.setItem(this.room, ta(Xl(t)));
  }
  close() {
    fl(this._onChange);
  }
}
const ra = typeof BroadcastChannel > "u" ? sa : BroadcastChannel, lr = (e) => Dt(co, e, () => {
  const t = zt(), n = new ra(e);
  return n.onmessage = (s) => t.forEach((r) => r(s.data, "broadcastchannel")), {
    bc: n,
    subs: t
  };
}), ia = (e, t) => (lr(e).subs.add(t), t), oa = (e, t) => {
  const n = lr(e), s = n.subs.delete(t);
  return s && n.subs.size === 0 && (n.bc.close(), co.delete(e)), s;
}, ie = (e, t, n = null) => {
  const s = lr(e);
  s.bc.postMessage(t), s.subs.forEach((r) => r(t, n));
};
class ca {
  constructor() {
    this._observers = tt();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(t, n) {
    return Dt(
      this._observers,
      /** @type {string} */
      t,
      zt
    ).add(n), n;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(t, n) {
    const s = (...r) => {
      this.off(
        t,
        /** @type {any} */
        s
      ), n(...r);
    };
    this.on(
      t,
      /** @type {any} */
      s
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(t, n) {
    const s = this._observers.get(t);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(t));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(t, n) {
    return It((this._observers.get(t) || tt()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = tt();
  }
}
class lo {
  constructor() {
    this._observers = tt();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(t, n) {
    Dt(this._observers, t, zt).add(n);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(t, n) {
    const s = (...r) => {
      this.off(t, s), n(...r);
    };
    this.on(t, s);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(t, n) {
    const s = this._observers.get(t);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(t));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(t, n) {
    return It((this._observers.get(t) || tt()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = tt();
  }
}
const Xt = Date.now, la = (e) => wl(e, (t, n) => `${encodeURIComponent(n)}=${encodeURIComponent(t)}`).join("&"), aa = crypto.getRandomValues.bind(crypto), ao = () => aa(new Uint32Array(1))[0], ha = "10000000-1000-4000-8000" + -1e11, ua = () => ha.replace(
  /[018]/g,
  /** @param {number} c */
  (e) => (e ^ ao() & 15 >> e / 4).toString(16)
), ii = (e) => (
  /** @type {Promise<T>} */
  new Promise(e)
);
Promise.all.bind(Promise);
class da {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(t, n) {
    this.left = t, this.right = n;
  }
}
const _t = (e, t) => new da(e, t), oi = (e) => e.next() >= 0.5, gs = (e, t, n) => gt(e.next() * (n + 1 - t) + t), ho = (e, t, n) => gt(e.next() * (n + 1 - t) + t), ar = (e, t, n) => ho(e, t, n), fa = (e) => Zi(ar(e, 97, 122)), pa = (e, t = 0, n = 20) => {
  const s = ar(e, t, n);
  let r = "";
  for (let i = 0; i < s; i++)
    r += fa(e);
  return r;
}, ys = (e, t) => t[ar(e, 0, t.length - 1)], ga = /* @__PURE__ */ Symbol("0schema");
class ya {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(t, n, s, r = null) {
    this._rerrs.push({ path: t, expected: n, has: s, message: r });
  }
  toString() {
    const t = [];
    for (let n = this._rerrs.length - 1; n > 0; n--) {
      const s = this._rerrs[n];
      t.push(hl(" ", (this._rerrs.length - n) * 2) + `${s.path != null ? `[${s.path}] ` : ""}${s.has} doesn't match ${s.expected}. ${s.message}`);
    }
    return t.join(`
`);
  }
}
const Ts = (e, t) => e === t ? !0 : e == null || t == null || e.constructor !== t.constructor ? !1 : e[Oe] ? to(e, t) : Bn(e) ? qs(
  e,
  (n) => Ji(t, (s) => Ts(n, s))
) : pl(e) ? We(
  e,
  (n, s) => Ts(n, t[s])
) : !1;
class Q {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = !1;
  /**
   * @param {Schema<any>} other
   */
  extends(t) {
    let [n, s] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      t.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([s, n] = [n, s]), Ts(n, s)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(t) {
    return this.constructor === t.constructor && ce(this.shape, t.shape);
  }
  [ga]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [Oe](t) {
    return this.equals(
      /** @type {any} */
      t
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(t) {
    return this.check(t);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(t, n) {
    pt();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return we(this, Kn);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new po(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(t) {
    return ci(t, this), /** @type {any} */
    t;
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(t) {
    return ci(t, this), t;
  }
}
class hr extends Q {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(t, n) {
    super(), this.shape = t, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(t, n = void 0) {
    const s = t?.constructor === this.shape && (this._c == null || this._c(t));
    return !s && n?.extend(null, this.shape.name, t?.constructor.name, t?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), s;
  }
}
const j = (e, t = null) => new hr(e, t);
j(hr);
class ur extends Q {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(t, n) {
    const s = this.shape(t);
    return !s && n?.extend(null, "custom prop", t?.constructor.name, "failed to check custom prop"), s;
  }
}
const K = (e) => new ur(e);
j(ur);
class Hn extends Q {
  /**
   * @param {Array<T>} literals
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(t, n) {
    const s = this.shape.some((r) => r === t);
    return !s && n?.extend(null, this.shape.join(" | "), t.toString()), s;
  }
}
const Vn = (...e) => new Hn(e), uo = j(Hn), ma = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((e) => e.replace(/[().|&,$^[\]]/g, (t) => "\\" + t))
), fo = (e) => {
  if (pe.check(e))
    return [ma(e)];
  if (uo.check(e))
    return (
      /** @type {Array<string|number>} */
      e.shape.map((t) => t + "")
    );
  if (Ao.check(e))
    return ["[+-]?\\d+.?\\d*"];
  if (So.check(e))
    return [".*"];
  if (En.check(e))
    return e.shape.map(fo).flat(1);
  ut();
};
class wa extends Q {
  /**
   * @param {T} shape
   */
  constructor(t) {
    super(), this.shape = t, this._r = new RegExp("^" + t.map(fo).map((n) => `(${n.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(t, n) {
    const s = this._r.exec(t) != null;
    return !s && n?.extend(null, this._r.toString(), t.toString(), "String doesn't match string template."), s;
  }
}
j(wa);
const ba = /* @__PURE__ */ Symbol("optional");
class po extends Q {
  /**
   * @param {S} shape
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(t, n) {
    const s = t === void 0 || this.shape.check(t);
    return !s && n?.extend(null, "undefined (optional)", "()"), s;
  }
  get [ba]() {
    return !0;
  }
}
const xa = j(po);
class Ca extends Q {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(t, n) {
    return n?.extend(null, "never", typeof t), !1;
  }
}
j(Ca);
class $n extends Q {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(t, n = !1) {
    super(), this.shape = t, this._isPartial = n;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new $n(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(t, n) {
    return t == null ? (n?.extend(null, "object", "null"), !1) : We(this.shape, (s, r) => {
      const i = this._isPartial && !tr(t, r) || s.check(t[r], n);
      return !i && n?.extend(r.toString(), s.toString(), typeof t[r], "Object property does not match"), i;
    });
  }
}
const va = (e) => (
  /** @type {any} */
  new $n(e)
), Aa = j($n), Sa = K((e) => e != null && (e.constructor === Object || e.constructor == null));
class go extends Q {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(t, n) {
    super(), this.shape = {
      keys: t,
      values: n
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(t, n) {
    return t != null && We(t, (s, r) => {
      const i = this.shape.keys.check(r, n);
      return !i && n?.extend(r + "", "Record", typeof t, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(s, n);
    });
  }
}
const yo = (e, t) => new go(e, t), Ea = j(go);
class mo extends Q {
  /**
   * @param {S} shape
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(t, n) {
    return t != null && We(this.shape, (s, r) => {
      const i = (
        /** @type {Schema<any>} */
        s.check(t[r], n)
      );
      return !i && n?.extend(r.toString(), "Tuple", typeof s), i;
    });
  }
}
const ka = (...e) => new mo(e);
j(mo);
class wo extends Q {
  /**
   * @param {Array<S>} v
   */
  constructor(t) {
    super(), this.shape = t.length === 1 ? t[0] : new dr(t);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(t, n) {
    const s = Bn(t) && qs(t, (r) => this.shape.check(r));
    return !s && n?.extend(null, "Array", ""), s;
  }
}
const bo = (...e) => new wo(e), Da = j(wo), _a = K((e) => Bn(e));
class xo extends Q {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(t, n) {
    super(), this.shape = t, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(t, n) {
    const s = t instanceof this.shape && (this._c == null || this._c(t));
    return !s && n?.extend(null, this.shape.name, t?.constructor.name), s;
  }
}
const Ma = (e, t = null) => new xo(e, t);
j(xo);
const Ia = Ma(Q);
class La extends Q {
  /**
   * @param {Args} args
   */
  constructor(t) {
    super(), this.len = t.length - 1, this.args = ka(...t.slice(-1)), this.res = t[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(t, n) {
    const s = t.constructor === Function && t.length <= this.len;
    return !s && n?.extend(null, "function", typeof t), s;
  }
}
const Ta = j(La), Oa = K((e) => typeof e == "function");
class Ra extends Q {
  /**
   * @param {T} v
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(t, n) {
    const s = qs(this.shape, (r) => r.check(t, n));
    return !s && n?.extend(null, "Intersectinon", typeof t), s;
  }
}
j(Ra, (e) => e.shape.length > 0);
class dr extends Q {
  static _dilutes = !0;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(t) {
    super(), this.shape = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(t, n) {
    const s = Ji(this.shape, (r) => r.check(t, n));
    return n?.extend(null, "Union", typeof t), s;
  }
}
const we = (...e) => e.findIndex((t) => En.check(t)) >= 0 ? we(...e.map((t) => Pe(t)).map((t) => En.check(t) ? t.shape : [t]).flat(1)) : e.length === 1 ? e[0] : new dr(e), En = (
  /** @type {Schema<$Union<any>>} */
  j(dr)
), Co = () => !0, kn = K(Co), Na = (
  /** @type {Schema<Schema<any>>} */
  j(ur, (e) => e.shape === Co)
), fr = K((e) => typeof e == "bigint"), Ua = (
  /** @type {Schema<Schema<BigInt>>} */
  K((e) => e === fr)
), vo = K((e) => typeof e == "symbol");
K((e) => e === vo);
const le = K((e) => typeof e == "number"), Ao = (
  /** @type {Schema<Schema<number>>} */
  K((e) => e === le)
), pe = K((e) => typeof e == "string"), So = (
  /** @type {Schema<Schema<string>>} */
  K((e) => e === pe)
), Yn = K((e) => typeof e == "boolean"), Pa = (
  /** @type {Schema<Schema<Boolean>>} */
  K((e) => e === Yn)
), Eo = Vn(void 0);
j(Hn, (e) => e.shape.length === 1 && e.shape[0] === void 0);
Vn(void 0);
const Kn = Vn(null), Ba = (
  /** @type {Schema<Schema<null>>} */
  j(Hn, (e) => e.shape.length === 1 && e.shape[0] === null)
);
j(Uint8Array);
j(hr, (e) => e.shape === Uint8Array);
const ja = we(le, pe, Kn, Eo, fr, Yn, vo);
(() => {
  const e = (
    /** @type {$Array<$any>} */
    bo(kn)
  ), t = (
    /** @type {$Record<$string,$any>} */
    yo(pe, kn)
  ), n = we(le, pe, Kn, Yn, e, t);
  return e.shape = n, t.shape.values = n, n;
})();
const Pe = (e) => {
  if (Ia.check(e))
    return (
      /** @type {any} */
      e
    );
  if (Sa.check(e)) {
    const t = {};
    for (const n in e)
      t[n] = Pe(e[n]);
    return (
      /** @type {any} */
      va(t)
    );
  } else {
    if (_a.check(e))
      return (
        /** @type {any} */
        we(...e.map(Pe))
      );
    if (ja.check(e))
      return (
        /** @type {any} */
        Vn(e)
      );
    if (Oa.check(e))
      return (
        /** @type {any} */
        j(
          /** @type {any} */
          e
        )
      );
  }
  ut();
}, ci = Sl ? () => {
} : (e, t) => {
  const n = new ya();
  if (!t.check(e, n))
    throw vt(`Expected value to be of type ${t.constructor.name}.
${n.toString()}`);
};
class za {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor(t) {
    this.patterns = [], this.$state = t;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(t, n) {
    return this.patterns.push({ if: Pe(t), h: n }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(t) {
    return this.if(kn, t);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (t, n) => {
        for (let s = 0; s < this.patterns.length; s++) {
          const r = this.patterns[s];
          if (r.if.check(t))
            return r.h(t, n);
        }
        throw vt("Unhandled pattern");
      }
    );
  }
}
const Fa = (e) => new za(
  /** @type {any} */
  e
), ko = (
  /** @type {any} */
  Fa(
    /** @type {Schema<prng.PRNG>} */
    kn
  ).if(Ao, (e, t) => gs(t, Qr, Sn)).if(So, (e, t) => pa(t)).if(Pa, (e, t) => oi(t)).if(Ua, (e, t) => BigInt(gs(t, Qr, Sn))).if(En, (e, t) => re(t, ys(t, e.shape))).if(Aa, (e, t) => {
    const n = {};
    for (const s in e.shape) {
      let r = e.shape[s];
      if (xa.check(r)) {
        if (oi(t))
          continue;
        r = r.shape;
      }
      n[s] = ko(r, t);
    }
    return n;
  }).if(Da, (e, t) => {
    const n = [], s = ho(t, 0, 42);
    for (let r = 0; r < s; r++)
      n.push(re(t, e.shape));
    return n;
  }).if(uo, (e, t) => ys(t, e.shape)).if(Ba, (e, t) => null).if(Ta, (e, t) => {
    const n = re(t, e.res);
    return () => n;
  }).if(Na, (e, t) => re(t, ys(t, [
    le,
    pe,
    Kn,
    Eo,
    fr,
    Yn,
    bo(le),
    yo(we("a", "b", "c"), le)
  ]))).if(Ea, (e, t) => {
    const n = {}, s = gs(t, 0, 3);
    for (let r = 0; r < s; r++) {
      const i = re(t, e.shape.keys), o = re(t, e.shape.values);
      n[i] = o;
    }
    return n;
  }).done()
), re = (e, t) => (
  /** @type {any} */
  ko(Pe(t), e)
), Gn = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
K((e) => e.nodeType === Ka);
typeof DOMParser < "u" && new DOMParser();
K((e) => e.nodeType === Va);
K((e) => e.nodeType === $a);
const Ha = (e) => Qc(e, (t, n) => `${n}:${t};`).join(""), Va = Gn.ELEMENT_NODE, $a = Gn.TEXT_NODE, Ya = Gn.DOCUMENT_NODE, Ka = Gn.DOCUMENT_FRAGMENT_NODE;
K((e) => e.nodeType === Ya);
const Ot = Symbol, Do = Ot(), _o = Ot(), Ga = Ot(), Wa = Ot(), Xa = Ot(), Mo = Ot(), Ja = Ot(), Io = Ot(), Za = Ot(), qa = (e) => {
  e.length === 1 && e[0]?.constructor === Function && (e = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  e[0]());
  const t = [], n = [];
  let s = 0;
  for (; s < e.length; s++) {
    const r = e[s];
    if (r === void 0)
      break;
    if (r.constructor === String || r.constructor === Number)
      t.push(r);
    else if (r.constructor === Object)
      break;
  }
  for (s > 0 && n.push(t.join("")); s < e.length; s++) {
    const r = e[s];
    r instanceof Symbol || n.push(r);
  }
  return n;
}, Qa = {
  [Do]: _t("font-weight", "bold"),
  [_o]: _t("font-weight", "normal"),
  [Ga]: _t("color", "blue"),
  [Xa]: _t("color", "green"),
  [Wa]: _t("color", "grey"),
  [Mo]: _t("color", "red"),
  [Ja]: _t("color", "purple"),
  [Io]: _t("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [Za]: _t("color", "black")
}, th = (e) => {
  e.length === 1 && e[0]?.constructor === Function && (e = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  e[0]());
  const t = [], n = [], s = tt();
  let r = [], i = 0;
  for (; i < e.length; i++) {
    const o = e[i], c = Qa[o];
    if (c !== void 0)
      s.set(c.left, c.right);
    else {
      if (o === void 0)
        break;
      if (o.constructor === String || o.constructor === Number) {
        const l = Ha(s);
        i > 0 || l.length > 0 ? (t.push("%c" + o), n.push(l)) : t.push(o);
      } else
        break;
    }
  }
  for (i > 0 && (r = n, r.unshift(t.join(""))); i < e.length; i++) {
    const o = e[i];
    o instanceof Symbol || r.push(o);
  }
  return r;
}, eh = kl ? th : qa, nh = (...e) => {
  console.log(...eh(e)), sh.forEach((t) => t.print(e));
}, sh = zt(), Lo = (e) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: e
}), rh = (e, t) => Lo(() => {
  let n;
  do
    n = e.next();
  while (!n.done && !t(n.value));
  return n;
}), ms = (e, t) => Lo(() => {
  const { done: n, value: s } = e.next();
  return { done: n, value: n ? void 0 : t(s) };
});
class pr {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(t, n) {
    this.clock = t, this.len = n;
  }
}
class Je {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const To = (e, t, n) => t.clients.forEach((s, r) => {
  const i = (
    /** @type {Array<GC|Item>} */
    e.doc.store.clients.get(r)
  );
  for (let o = 0; o < s.length; o++) {
    const c = s[o];
    Yo(e, i, c.clock, c.len, n);
  }
}), ih = (e, t) => {
  let n = 0, s = e.length - 1;
  for (; n <= s; ) {
    const r = gt((n + s) / 2), i = e[r], o = i.clock;
    if (o <= t) {
      if (t < o + i.len)
        return r;
      n = r + 1;
    } else
      s = r - 1;
  }
  return null;
}, Oo = (e, t) => {
  const n = e.clients.get(t.client);
  return n !== void 0 && ih(n, t.clock) !== null;
}, gr = (e) => {
  e.clients.forEach((t) => {
    t.sort((r, i) => r.clock - i.clock);
    let n, s;
    for (n = 1, s = 1; n < t.length; n++) {
      const r = t[s - 1], i = t[n];
      r.clock + r.len >= i.clock ? r.len = ee(r.len, i.clock + i.len - r.clock) : (s < n && (t[s] = i), s++);
    }
    t.length = s;
  });
}, oh = (e) => {
  const t = new Je();
  for (let n = 0; n < e.length; n++)
    e[n].clients.forEach((s, r) => {
      if (!t.clients.has(r)) {
        const i = s.slice();
        for (let o = n + 1; o < e.length; o++)
          el(i, e[o].clients.get(r) || []);
        t.clients.set(r, i);
      }
    });
  return gr(t), t;
}, Dn = (e, t, n, s) => {
  Dt(e.clients, t, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new pr(n, s));
}, ch = () => new Je(), lh = (e) => {
  const t = ch();
  return e.clients.forEach((n, s) => {
    const r = [];
    for (let i = 0; i < n.length; i++) {
      const o = n[i];
      if (o.deleted) {
        const c = o.id.clock;
        let l = o.length;
        if (i + 1 < n.length)
          for (let a = n[i + 1]; i + 1 < n.length && a.deleted; a = n[++i + 1])
            l += a.length;
        r.push(new pr(c, l));
      }
    }
    r.length > 0 && t.clients.set(s, r);
  }), t;
}, be = (e, t) => {
  b(e.restEncoder, t.clients.size), It(t.clients.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
    e.resetDsCurVal(), b(e.restEncoder, n);
    const r = s.length;
    b(e.restEncoder, r);
    for (let i = 0; i < r; i++) {
      const o = s[i];
      e.writeDsClock(o.clock), e.writeDsLen(o.len);
    }
  });
}, yr = (e) => {
  const t = new Je(), n = A(e.restDecoder);
  for (let s = 0; s < n; s++) {
    e.resetDsCurVal();
    const r = A(e.restDecoder), i = A(e.restDecoder);
    if (i > 0) {
      const o = Dt(t.clients, r, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let c = 0; c < i; c++)
        o.push(new pr(e.readDsClock(), e.readDsLen()));
    }
  }
  return t;
}, li = (e, t, n) => {
  const s = new Je(), r = A(e.restDecoder);
  for (let i = 0; i < r; i++) {
    e.resetDsCurVal();
    const o = A(e.restDecoder), c = A(e.restDecoder), l = n.clients.get(o) || [], a = Y(n, o);
    for (let h = 0; h < c; h++) {
      const u = e.readDsClock(), d = u + e.readDsLen();
      if (u < a) {
        a < d && Dn(s, o, a, d - a);
        let f = yt(l, u), p = l[f];
        for (!p.deleted && p.id.clock < u && (l.splice(f + 1, 0, Tn(t, p, u - p.id.clock)), f++); f < l.length && (p = l[f++], p.id.clock < d); )
          p.deleted || (d < p.id.clock + p.length && l.splice(f, 0, Tn(t, p, d - p.id.clock)), p.delete(t));
      } else
        Dn(s, o, u, d - u);
    }
  }
  if (s.clients.size > 0) {
    const i = new Jt();
    return b(i.restEncoder, 0), be(i, s), i.toUint8Array();
  }
  return null;
}, Ro = ao;
class mt extends ca {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: t = ua(), collectionid: n = null, gc: s = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: o = !1, shouldLoad: c = !0 } = {}) {
    super(), this.gc = s, this.gcFilter = r, this.clientID = Ro(), this.guid = t, this.collectionid = n, this.share = /* @__PURE__ */ new Map(), this.store = new Vo(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = c, this.autoLoad = o, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.whenLoaded = ii((a) => {
      this.on("load", () => {
        this.isLoaded = !0, a(this);
      });
    });
    const l = () => ii((a) => {
      const h = (u) => {
        (u === void 0 || u === !0) && (this.off("sync", h), a());
      };
      this.on("sync", h);
    });
    this.on("sync", (a) => {
      a === !1 && this.isSynced && (this.whenSynced = l()), this.isSynced = a === void 0 || a === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = l();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const t = this._item;
    t !== null && !this.shouldLoad && T(
      /** @type {any} */
      t.parent.doc,
      (n) => {
        n.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(It(this.subdocs).map((t) => t.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(t, n = null) {
    return T(this, t, n);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(t, n = (
    /** @type {any} */
    U
  )) {
    const s = Dt(this.share, t, () => {
      const i = new n();
      return i._integrate(this, null), i;
    }), r = s.constructor;
    if (n !== U && r !== n)
      if (r === U) {
        const i = new n();
        i._map = s._map, s._map.forEach(
          /** @param {Item?} n */
          (o) => {
            for (; o !== null; o = o.left)
              o.parent = i;
          }
        ), i._start = s._start;
        for (let o = i._start; o !== null; o = o.right)
          o.parent = i;
        return i._length = s._length, this.share.set(t, i), i._integrate(this, null), /** @type {InstanceType<Type>} */
        i;
      } else
        throw new Error(`Type with the name ${t} has already been defined with a different constructor`);
    return (
      /** @type {InstanceType<Type>} */
      s
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(t = "") {
    return (
      /** @type {YArray<T>} */
      this.get(t, xt)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(t = "") {
    return this.get(t, Lt);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(t = "") {
    return (
      /** @type {YMap<T>} */
      this.get(t, At)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(t = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(t, Tt)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(t = "") {
    return this.get(t, St);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const t = {};
    return this.share.forEach((n, s) => {
      t[s] = n.toJSON();
    }), t;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    It(this.subdocs).forEach((n) => n.destroy());
    const t = this._item;
    if (t !== null) {
      this._item = null;
      const n = (
        /** @type {ContentDoc} */
        t.content
      );
      n.doc = new mt({ guid: this.guid, ...n.opts, shouldLoad: !1 }), n.doc._item = t, T(
        /** @type {any} */
        t.parent.doc,
        (s) => {
          const r = n.doc;
          t.deleted || s.subdocsAdded.add(r), s.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class No {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    this.restDecoder = t;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return A(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return A(this.restDecoder);
  }
}
class Uo extends No {
  /**
   * @return {ID}
   */
  readLeftID() {
    return _(A(this.restDecoder), A(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return _(A(this.restDecoder), A(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return A(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return fe(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return jt(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return A(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return A(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return A(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return Ue(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return na(Z(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(jt(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return jt(this.restDecoder);
  }
}
class ah {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    this.dsCurrVal = 0, this.restDecoder = t;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return this.dsCurrVal += A(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const t = A(this.restDecoder) + 1;
    return this.dsCurrVal += t, t;
  }
}
class ge extends ah {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(t) {
    super(t), this.keys = [], A(t), this.keyClockDecoder = new ps(Z(t)), this.clientDecoder = new xn(Z(t)), this.leftClockDecoder = new ps(Z(t)), this.rightClockDecoder = new ps(Z(t)), this.infoDecoder = new ri(Z(t), fe), this.stringDecoder = new Gl(Z(t)), this.parentInfoDecoder = new ri(Z(t), fe), this.typeRefDecoder = new xn(Z(t)), this.lenDecoder = new xn(Z(t));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new ae(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new ae(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return Ue(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return Z(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return Ue(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const t = this.keyClockDecoder.read();
    if (t < this.keys.length)
      return this.keys[t];
    {
      const n = this.stringDecoder.read();
      return this.keys.push(n), n;
    }
  }
}
class Po {
  constructor() {
    this.restEncoder = q();
  }
  toUint8Array() {
    return R(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    b(this.restEncoder, t);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    b(this.restEncoder, t);
  }
}
class Ze extends Po {
  /**
   * @param {ID} id
   */
  writeLeftID(t) {
    b(this.restEncoder, t.client), b(this.restEncoder, t.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(t) {
    b(this.restEncoder, t.client), b(this.restEncoder, t.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(t) {
    b(this.restEncoder, t);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(t) {
    Is(this.restEncoder, t);
  }
  /**
   * @param {string} s
   */
  writeString(t) {
    Kt(this.restEncoder, t);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(t) {
    b(this.restEncoder, t ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(t) {
    b(this.restEncoder, t);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(t) {
    b(this.restEncoder, t);
  }
  /**
   * @param {any} any
   */
  writeAny(t) {
    Ne(this.restEncoder, t);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(t) {
    B(this.restEncoder, t);
  }
  /**
   * @param {any} embed
   */
  writeJSON(t) {
    Kt(this.restEncoder, JSON.stringify(t));
  }
  /**
   * @param {string} key
   */
  writeKey(t) {
    Kt(this.restEncoder, t);
  }
}
class Bo {
  constructor() {
    this.restEncoder = q(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return R(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(t) {
    const n = t - this.dsCurrVal;
    this.dsCurrVal = t, b(this.restEncoder, n);
  }
  /**
   * @param {number} len
   */
  writeDsLen(t) {
    t === 0 && ut(), b(this.restEncoder, t - 1), this.dsCurrVal += t;
  }
}
class Jt extends Bo {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new fs(), this.clientEncoder = new bn(), this.leftClockEncoder = new fs(), this.rightClockEncoder = new fs(), this.infoEncoder = new ei(Is), this.stringEncoder = new Bl(), this.parentInfoEncoder = new ei(Is), this.typeRefEncoder = new bn(), this.lenEncoder = new bn();
  }
  toUint8Array() {
    const t = q();
    return b(t, 0), B(t, this.keyClockEncoder.toUint8Array()), B(t, this.clientEncoder.toUint8Array()), B(t, this.leftClockEncoder.toUint8Array()), B(t, this.rightClockEncoder.toUint8Array()), B(t, R(this.infoEncoder)), B(t, this.stringEncoder.toUint8Array()), B(t, R(this.parentInfoEncoder)), B(t, this.typeRefEncoder.toUint8Array()), B(t, this.lenEncoder.toUint8Array()), zn(t, R(this.restEncoder)), R(t);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(t) {
    this.clientEncoder.write(t.client), this.leftClockEncoder.write(t.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(t) {
    this.clientEncoder.write(t.client), this.rightClockEncoder.write(t.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(t) {
    this.clientEncoder.write(t);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(t) {
    this.infoEncoder.write(t);
  }
  /**
   * @param {string} s
   */
  writeString(t) {
    this.stringEncoder.write(t);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(t) {
    this.parentInfoEncoder.write(t ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(t) {
    this.typeRefEncoder.write(t);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(t) {
    this.lenEncoder.write(t);
  }
  /**
   * @param {any} any
   */
  writeAny(t) {
    Ne(this.restEncoder, t);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(t) {
    B(this.restEncoder, t);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(t) {
    Ne(this.restEncoder, t);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(t) {
    const n = this.keyMap.get(t);
    n === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(t)) : this.keyClockEncoder.write(n);
  }
}
const hh = (e, t, n, s) => {
  s = ee(s, t[0].id.clock);
  const r = yt(t, s);
  b(e.restEncoder, t.length - r), e.writeClient(n), b(e.restEncoder, s);
  const i = t[r];
  i.write(e, s - i.id.clock);
  for (let o = r + 1; o < t.length; o++)
    t[o].write(e, 0);
}, mr = (e, t, n) => {
  const s = /* @__PURE__ */ new Map();
  n.forEach((r, i) => {
    Y(t, i) > r && s.set(i, r);
  }), Wn(t).forEach((r, i) => {
    n.has(i) || s.set(i, 0);
  }), b(e.restEncoder, s.size), It(s.entries()).sort((r, i) => i[0] - r[0]).forEach(([r, i]) => {
    hh(
      e,
      /** @type {Array<GC|Item>} */
      t.clients.get(r),
      r,
      i
    );
  });
}, uh = (e, t) => {
  const n = tt(), s = A(e.restDecoder);
  for (let r = 0; r < s; r++) {
    const i = A(e.restDecoder), o = new Array(i), c = e.readClient();
    let l = A(e.restDecoder);
    n.set(c, { i: 0, refs: o });
    for (let a = 0; a < i; a++) {
      const h = e.readInfo();
      switch (jn & h) {
        case 0: {
          const u = e.readLen();
          o[a] = new nt(_(c, l), u), l += u;
          break;
        }
        case 10: {
          const u = A(e.restDecoder);
          o[a] = new lt(_(c, l), u), l += u;
          break;
        }
        default: {
          const u = (h & (Mt | st)) === 0, d = new z(
            _(c, l),
            null,
            // left
            (h & st) === st ? e.readLeftID() : null,
            // origin
            null,
            // right
            (h & Mt) === Mt ? e.readRightID() : null,
            // right origin
            u ? e.readParentInfo() ? t.get(e.readString()) : e.readLeftID() : null,
            // parent
            u && (h & Re) === Re ? e.readString() : null,
            // parentSub
            hc(e, h)
            // item content
          );
          o[a] = d, l += d.length;
        }
      }
    }
  }
  return n;
}, dh = (e, t, n) => {
  const s = [];
  let r = It(n.keys()).sort((f, p) => f - p);
  if (r.length === 0)
    return null;
  const i = () => {
    if (r.length === 0)
      return null;
    let f = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      n.get(r[r.length - 1])
    );
    for (; f.refs.length === f.i; )
      if (r.pop(), r.length > 0)
        f = /** @type {{i:number,refs:Array<GC|Item>}} */
        n.get(r[r.length - 1]);
      else
        return null;
    return f;
  };
  let o = i();
  if (o === null)
    return null;
  const c = new Vo(), l = /* @__PURE__ */ new Map(), a = (f, p) => {
    const g = l.get(f);
    (g == null || g > p) && l.set(f, p);
  };
  let h = (
    /** @type {any} */
    o.refs[
      /** @type {any} */
      o.i++
    ]
  );
  const u = /* @__PURE__ */ new Map(), d = () => {
    for (const f of s) {
      const p = f.id.client, g = n.get(p);
      g ? (g.i--, c.clients.set(p, g.refs.slice(g.i)), n.delete(p), g.i = 0, g.refs = []) : c.clients.set(p, [f]), r = r.filter((w) => w !== p);
    }
    s.length = 0;
  };
  for (; ; ) {
    if (h.constructor !== lt) {
      const p = Dt(u, h.id.client, () => Y(t, h.id.client)) - h.id.clock;
      if (p < 0)
        s.push(h), a(h.id.client, h.id.clock - 1), d();
      else {
        const g = h.getMissing(e, t);
        if (g !== null) {
          s.push(h);
          const w = n.get(
            /** @type {number} */
            g
          ) || { refs: [], i: 0 };
          if (w.refs.length === w.i)
            a(
              /** @type {number} */
              g,
              Y(t, g)
            ), d();
          else {
            h = w.refs[w.i++];
            continue;
          }
        } else (p === 0 || p < h.length) && (h.integrate(e, p), u.set(h.id.client, h.id.clock + h.length));
      }
    }
    if (s.length > 0)
      h = /** @type {GC|Item} */
      s.pop();
    else if (o !== null && o.i < o.refs.length)
      h = /** @type {GC|Item} */
      o.refs[o.i++];
    else {
      if (o = i(), o === null)
        break;
      h = /** @type {GC|Item} */
      o.refs[o.i++];
    }
  }
  if (c.clients.size > 0) {
    const f = new Jt();
    return mr(f, c, /* @__PURE__ */ new Map()), b(f.restEncoder, 0), { missing: l, update: f.toUint8Array() };
  }
  return null;
}, fh = (e, t) => mr(e, t.doc.store, t.beforeState), ph = (e, t, n, s = new ge(e)) => T(t, (r) => {
  r.local = !1;
  let i = !1;
  const o = r.doc, c = o.store, l = uh(s, o), a = dh(r, c, l), h = c.pendingStructs;
  if (h) {
    for (const [d, f] of h.missing)
      if (f < Y(c, d)) {
        i = !0;
        break;
      }
    if (a) {
      for (const [d, f] of a.missing) {
        const p = h.missing.get(d);
        (p == null || p > f) && h.missing.set(d, f);
      }
      h.update = _n([h.update, a.update]);
    }
  } else
    c.pendingStructs = a;
  const u = li(s, r, c);
  if (c.pendingDs) {
    const d = new ge(Ht(c.pendingDs));
    A(d.restDecoder);
    const f = li(d, r, c);
    u && f ? c.pendingDs = _n([u, f]) : c.pendingDs = u || f;
  } else
    c.pendingDs = u;
  if (i) {
    const d = (
      /** @type {{update: Uint8Array}} */
      c.pendingStructs.update
    );
    c.pendingStructs = null, jo(r.doc, d);
  }
}, n, !1), jo = (e, t, n, s = ge) => {
  const r = Ht(t);
  ph(r, e, n, new s(r));
}, gh = (e, t, n) => jo(e, t, n, Uo), yh = (e, t, n = /* @__PURE__ */ new Map()) => {
  mr(e, t.store, n), be(e, lh(t.store));
}, mh = (e, t = new Uint8Array([0]), n = new Jt()) => {
  const s = zo(t);
  yh(n, e, s);
  const r = [n.toUint8Array()];
  if (e.store.pendingDs && r.push(e.store.pendingDs), e.store.pendingStructs && r.push(Oh(e.store.pendingStructs.update, t)), r.length > 1) {
    if (n.constructor === Ze)
      return Lh(r.map((i, o) => o === 0 ? i : Nh(i)));
    if (n.constructor === Jt)
      return _n(r);
  }
  return r[0];
}, wh = (e, t) => mh(e, t, new Ze()), bh = (e) => {
  const t = /* @__PURE__ */ new Map(), n = A(e.restDecoder);
  for (let s = 0; s < n; s++) {
    const r = A(e.restDecoder), i = A(e.restDecoder);
    t.set(r, i);
  }
  return t;
}, zo = (e) => bh(new No(Ht(e))), Fo = (e, t) => (b(e.restEncoder, t.size), It(t.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
  b(e.restEncoder, n), b(e.restEncoder, s);
}), e), xh = (e, t) => Fo(e, Wn(t.store)), Ch = (e, t = new Bo()) => (e instanceof Map ? Fo(t, e) : xh(t, e), t.toUint8Array()), vh = (e) => Ch(e, new Po());
class Ah {
  constructor() {
    this.l = [];
  }
}
const ai = () => new Ah(), hi = (e, t) => e.l.push(t), ui = (e, t) => {
  const n = e.l, s = n.length;
  e.l = n.filter((r) => t !== r), s === e.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Ho = (e, t, n) => er(e.l, [t, n]);
class ae {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(t, n) {
    this.client = t, this.clock = n;
  }
}
const an = (e, t) => e === t || e !== null && t !== null && e.client === t.client && e.clock === t.clock, _ = (e, t) => new ae(e, t), Sh = (e) => {
  for (const [t, n] of e.doc.share.entries())
    if (n === e)
      return t;
  throw ut();
}, oe = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && (t.sv.get(e.id.client) || 0) > e.id.clock && !Oo(t.ds, e.id), Os = (e, t) => {
  const n = Dt(e.meta, Os, zt), s = e.doc.store;
  n.has(t) || (t.sv.forEach((r, i) => {
    r < Y(s, i) && Ft(e, _(i, r));
  }), To(e, t.ds, (r) => {
  }), n.add(t));
};
class Vo {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Wn = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.clients.forEach((n, s) => {
    const r = n[n.length - 1];
    t.set(s, r.id.clock + r.length);
  }), t;
}, Y = (e, t) => {
  const n = e.clients.get(t);
  if (n === void 0)
    return 0;
  const s = n[n.length - 1];
  return s.id.clock + s.length;
}, $o = (e, t) => {
  let n = e.clients.get(t.id.client);
  if (n === void 0)
    n = [], e.clients.set(t.id.client, n);
  else {
    const s = n[n.length - 1];
    if (s.id.clock + s.length !== t.id.clock)
      throw ut();
  }
  n.push(t);
}, yt = (e, t) => {
  let n = 0, s = e.length - 1, r = e[s], i = r.id.clock;
  if (i === t)
    return s;
  let o = gt(t / (i + r.length - 1) * s);
  for (; n <= s; ) {
    if (r = e[o], i = r.id.clock, i <= t) {
      if (t < i + r.length)
        return o;
      n = o + 1;
    } else
      s = o - 1;
    o = gt((n + s) / 2);
  }
  throw ut();
}, Eh = (e, t) => {
  const n = e.clients.get(t.client);
  return n[yt(n, t.clock)];
}, ws = (
  /** @type {function(StructStore,ID):Item} */
  Eh
), Rs = (e, t, n) => {
  const s = yt(t, n), r = t[s];
  return r.id.clock < n && r instanceof z ? (t.splice(s + 1, 0, Tn(e, r, n - r.id.clock)), s + 1) : s;
}, Ft = (e, t) => {
  const n = (
    /** @type {Array<Item>} */
    e.doc.store.clients.get(t.client)
  );
  return n[Rs(e, n, t.clock)];
}, di = (e, t, n) => {
  const s = t.clients.get(n.client), r = yt(s, n.clock), i = s[r];
  return n.clock !== i.id.clock + i.length - 1 && i.constructor !== nt && s.splice(r + 1, 0, Tn(e, i, n.clock - i.id.clock + 1)), i;
}, kh = (e, t, n) => {
  const s = (
    /** @type {Array<GC|Item>} */
    e.clients.get(t.id.client)
  );
  s[yt(s, t.id.clock)] = n;
}, Yo = (e, t, n, s, r) => {
  if (s === 0)
    return;
  const i = n + s;
  let o = Rs(e, t, n), c;
  do
    c = t[o++], i < c.id.clock + c.length && Rs(e, t, i), r(c);
  while (o < t.length && t[o].id.clock < i);
};
class Dh {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(t, n, s) {
    this.doc = t, this.deleteSet = new Je(), this.beforeState = Wn(t.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = n, this.meta = /* @__PURE__ */ new Map(), this.local = s, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const fi = (e, t) => t.deleteSet.clients.size === 0 && !tl(t.afterState, (n, s) => t.beforeState.get(s) !== n) ? !1 : (gr(t.deleteSet), fh(e, t), be(e, t.deleteSet), !0), pi = (e, t, n) => {
  const s = t._item;
  (s === null || s.id.clock < (e.beforeState.get(s.id.client) || 0) && !s.deleted) && Dt(e.changed, t, zt).add(n);
}, Cn = (e, t) => {
  let n = e[t], s = e[t - 1], r = t;
  for (; r > 0; n = s, s = e[--r - 1]) {
    if (s.deleted === n.deleted && s.constructor === n.constructor && s.mergeWith(n)) {
      n instanceof z && n.parentSub !== null && /** @type {AbstractType<any>} */
      n.parent._map.get(n.parentSub) === n && n.parent._map.set(
        n.parentSub,
        /** @type {Item} */
        s
      );
      continue;
    }
    break;
  }
  const i = t - r;
  return i && e.splice(t + 1 - i, i), i;
}, _h = (e, t, n) => {
  for (const [s, r] of e.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let o = r.length - 1; o >= 0; o--) {
      const c = r[o], l = c.clock + c.len;
      for (let a = yt(i, c.clock), h = i[a]; a < i.length && h.id.clock < l; h = i[++a]) {
        const u = i[a];
        if (c.clock + c.len <= u.id.clock)
          break;
        u instanceof z && u.deleted && !u.keep && n(u) && u.gc(t, !1);
      }
    }
  }
}, Mh = (e, t) => {
  e.clients.forEach((n, s) => {
    const r = (
      /** @type {Array<GC|Item>} */
      t.clients.get(s)
    );
    for (let i = n.length - 1; i >= 0; i--) {
      const o = n[i], c = nr(r.length - 1, 1 + yt(r, o.clock + o.len - 1));
      for (let l = c, a = r[l]; l > 0 && a.id.clock >= o.clock; a = r[l])
        l -= 1 + Cn(r, l);
    }
  });
}, Ko = (e, t) => {
  if (t < e.length) {
    const n = e[t], s = n.doc, r = s.store, i = n.deleteSet, o = n._mergeStructs;
    try {
      gr(i), n.afterState = Wn(n.doc.store), s.emit("beforeObserverCalls", [n, s]);
      const c = [];
      n.changed.forEach(
        (l, a) => c.push(() => {
          (a._item === null || !a._item.deleted) && a._callObserver(n, l);
        })
      ), c.push(() => {
        n.changedParentTypes.forEach((l, a) => {
          a._dEH.l.length > 0 && (a._item === null || !a._item.deleted) && (l = l.filter(
            (h) => h.target._item === null || !h.target._item.deleted
          ), l.forEach((h) => {
            h.currentTarget = a, h._path = null;
          }), l.sort((h, u) => h.path.length - u.path.length), Ho(a._dEH, l, n));
        });
      }), c.push(() => s.emit("afterTransaction", [n, s])), er(c, []), n._needFormattingCleanup && Xh(n);
    } finally {
      s.gc && _h(i, r, s.gcFilter), Mh(i, r), n.afterState.forEach((h, u) => {
        const d = n.beforeState.get(u) || 0;
        if (d !== h) {
          const f = (
            /** @type {Array<GC|Item>} */
            r.clients.get(u)
          ), p = ee(yt(f, d), 1);
          for (let g = f.length - 1; g >= p; )
            g -= 1 + Cn(f, g);
        }
      });
      for (let h = o.length - 1; h >= 0; h--) {
        const { client: u, clock: d } = o[h].id, f = (
          /** @type {Array<GC|Item>} */
          r.clients.get(u)
        ), p = yt(f, d);
        p + 1 < f.length && Cn(f, p + 1) > 1 || p > 0 && Cn(f, p);
      }
      if (!n.local && n.afterState.get(s.clientID) !== n.beforeState.get(s.clientID) && (nh(Io, Do, "[yjs] ", _o, Mo, "Changed the client-id because another client seems to be using it."), s.clientID = Ro()), s.emit("afterTransactionCleanup", [n, s]), s._observers.has("update")) {
        const h = new Ze();
        fi(h, n) && s.emit("update", [h.toUint8Array(), n.origin, s, n]);
      }
      if (s._observers.has("updateV2")) {
        const h = new Jt();
        fi(h, n) && s.emit("updateV2", [h.toUint8Array(), n.origin, s, n]);
      }
      const { subdocsAdded: c, subdocsLoaded: l, subdocsRemoved: a } = n;
      (c.size > 0 || a.size > 0 || l.size > 0) && (c.forEach((h) => {
        h.clientID = s.clientID, h.collectionid == null && (h.collectionid = s.collectionid), s.subdocs.add(h);
      }), a.forEach((h) => s.subdocs.delete(h)), s.emit("subdocs", [{ loaded: l, added: c, removed: a }, s, n]), a.forEach((h) => h.destroy())), e.length <= t + 1 ? (s._transactionCleanups = [], s.emit("afterAllTransactions", [s, e])) : Ko(e, t + 1);
    }
  }
}, T = (e, t, n = null, s = !0) => {
  const r = e._transactionCleanups;
  let i = !1, o = null;
  e._transaction === null && (i = !0, e._transaction = new Dh(e, n, s), r.push(e._transaction), r.length === 1 && e.emit("beforeAllTransactions", [e]), e.emit("beforeTransaction", [e._transaction, e]));
  try {
    o = t(e._transaction);
  } finally {
    if (i) {
      const c = e._transaction === r[0];
      e._transaction = null, c && Ko(r, 0);
    }
  }
  return o;
};
function* Ih(e) {
  const t = A(e.restDecoder);
  for (let n = 0; n < t; n++) {
    const s = A(e.restDecoder), r = e.readClient();
    let i = A(e.restDecoder);
    for (let o = 0; o < s; o++) {
      const c = e.readInfo();
      if (c === 10) {
        const l = A(e.restDecoder);
        yield new lt(_(r, i), l), i += l;
      } else if ((jn & c) !== 0) {
        const l = (c & (Mt | st)) === 0, a = new z(
          _(r, i),
          null,
          // left
          (c & st) === st ? e.readLeftID() : null,
          // origin
          null,
          // right
          (c & Mt) === Mt ? e.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          l ? e.readParentInfo() ? e.readString() : e.readLeftID() : null,
          // parent
          l && (c & Re) === Re ? e.readString() : null,
          // parentSub
          hc(e, c)
          // item content
        );
        yield a, i += a.length;
      } else {
        const l = e.readLen();
        yield new nt(_(r, i), l), i += l;
      }
    }
  }
}
class wr {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(t, n) {
    this.gen = Ih(t), this.curr = null, this.done = !1, this.filterSkips = n, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === lt);
    return this.curr;
  }
}
class br {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(t) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = t, this.clientStructs = [];
  }
}
const Lh = (e) => _n(e, Uo, Ze), Th = (e, t) => {
  if (e.constructor === nt) {
    const { client: n, clock: s } = e.id;
    return new nt(_(n, s + t), e.length - t);
  } else if (e.constructor === lt) {
    const { client: n, clock: s } = e.id;
    return new lt(_(n, s + t), e.length - t);
  } else {
    const n = (
      /** @type {Item} */
      e
    ), { client: s, clock: r } = n.id;
    return new z(
      _(s, r + t),
      null,
      _(s, r + t - 1),
      null,
      n.rightOrigin,
      n.parent,
      n.parentSub,
      n.content.splice(t)
    );
  }
}, _n = (e, t = ge, n = Jt) => {
  if (e.length === 1)
    return e[0];
  const s = e.map((h) => new t(Ht(h)));
  let r = s.map((h) => new wr(h, !0)), i = null;
  const o = new n(), c = new br(o);
  for (; r = r.filter((d) => d.curr !== null), r.sort(
    /** @type {function(any,any):number} */
    (d, f) => {
      if (d.curr.id.client === f.curr.id.client) {
        const p = d.curr.id.clock - f.curr.id.clock;
        return p === 0 ? d.curr.constructor === f.curr.constructor ? 0 : d.curr.constructor === lt ? 1 : -1 : p;
      } else
        return f.curr.id.client - d.curr.id.client;
    }
  ), r.length !== 0; ) {
    const h = r[0], u = (
      /** @type {Item | GC} */
      h.curr.id.client
    );
    if (i !== null) {
      let d = (
        /** @type {Item | GC | null} */
        h.curr
      ), f = !1;
      for (; d !== null && d.id.clock + d.length <= i.struct.id.clock + i.struct.length && d.id.client >= i.struct.id.client; )
        d = h.next(), f = !0;
      if (d === null || // current decoder is empty
      d.id.client !== u || // check whether there is another decoder that has has updates from `firstClient`
      f && d.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (u !== i.struct.id.client)
        Pt(c, i.struct, i.offset), i = { struct: d, offset: 0 }, h.next();
      else if (i.struct.id.clock + i.struct.length < d.id.clock)
        if (i.struct.constructor === lt)
          i.struct.length = d.id.clock + d.length - i.struct.id.clock;
        else {
          Pt(c, i.struct, i.offset);
          const p = d.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new lt(_(u, i.struct.id.clock + i.struct.length), p), offset: 0 };
        }
      else {
        const p = i.struct.id.clock + i.struct.length - d.id.clock;
        p > 0 && (i.struct.constructor === lt ? i.struct.length -= p : d = Th(d, p)), i.struct.mergeWith(
          /** @type {any} */
          d
        ) || (Pt(c, i.struct, i.offset), i = { struct: d, offset: 0 }, h.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        h.curr
      ), offset: 0 }, h.next();
    for (let d = h.curr; d !== null && d.id.client === u && d.id.clock === i.struct.id.clock + i.struct.length && d.constructor !== lt; d = h.next())
      Pt(c, i.struct, i.offset), i = { struct: d, offset: 0 };
  }
  i !== null && (Pt(c, i.struct, i.offset), i = null), xr(c);
  const l = s.map((h) => yr(h)), a = oh(l);
  return be(o, a), o.toUint8Array();
}, Oh = (e, t, n = ge, s = Jt) => {
  const r = zo(t), i = new s(), o = new br(i), c = new n(Ht(e)), l = new wr(c, !1);
  for (; l.curr; ) {
    const h = l.curr, u = h.id.client, d = r.get(u) || 0;
    if (l.curr.constructor === lt) {
      l.next();
      continue;
    }
    if (h.id.clock + h.length > d)
      for (Pt(o, h, ee(d - h.id.clock, 0)), l.next(); l.curr && l.curr.id.client === u; )
        Pt(o, l.curr, 0), l.next();
    else
      for (; l.curr && l.curr.id.client === u && l.curr.id.clock + l.curr.length <= d; )
        l.next();
  }
  xr(o);
  const a = yr(c);
  return be(i, a), i.toUint8Array();
}, Go = (e) => {
  e.written > 0 && (e.clientStructs.push({ written: e.written, restEncoder: R(e.encoder.restEncoder) }), e.encoder.restEncoder = q(), e.written = 0);
}, Pt = (e, t, n) => {
  e.written > 0 && e.currClient !== t.id.client && Go(e), e.written === 0 && (e.currClient = t.id.client, e.encoder.writeClient(t.id.client), b(e.encoder.restEncoder, t.id.clock + n)), t.write(e.encoder, n), e.written++;
}, xr = (e) => {
  Go(e);
  const t = e.encoder.restEncoder;
  b(t, e.clientStructs.length);
  for (let n = 0; n < e.clientStructs.length; n++) {
    const s = e.clientStructs[n];
    b(t, s.written), zn(t, s.restEncoder);
  }
}, Rh = (e, t, n, s) => {
  const r = new n(Ht(e)), i = new wr(r, !1), o = new s(), c = new br(o);
  for (let a = i.curr; a !== null; a = i.next())
    Pt(c, t(a), 0);
  xr(c);
  const l = yr(r);
  return be(o, l), o.toUint8Array();
}, Nh = (e) => Rh(e, Cl, ge, Ze), gi = "You must not compute changes after the event-handler fired.";
class Xn {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(t, n) {
    this.target = t, this.currentTarget = t, this.transaction = n, this._changes = null, this._keys = null, this._delta = null, this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = Uh(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(t) {
    return Oo(this.transaction.deleteSet, t.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw vt(gi);
      const t = /* @__PURE__ */ new Map(), n = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(n).forEach((r) => {
        if (r !== null) {
          const i = (
            /** @type {Item} */
            n._map.get(r)
          );
          let o, c;
          if (this.adds(i)) {
            let l = i.left;
            for (; l !== null && this.adds(l); )
              l = l.left;
            if (this.deletes(i))
              if (l !== null && this.deletes(l))
                o = "delete", c = hs(l.content.getContent());
              else
                return;
            else
              l !== null && this.deletes(l) ? (o = "update", c = hs(l.content.getContent())) : (o = "add", c = void 0);
          } else if (this.deletes(i))
            o = "delete", c = hs(
              /** @type {Item} */
              i.content.getContent()
            );
          else
            return;
          t.set(r, { action: o, oldValue: c });
        }
      }), this._keys = t;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(t) {
    return t.id.clock >= (this.transaction.beforeState.get(t.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let t = this._changes;
    if (t === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw vt(gi);
      const n = this.target, s = zt(), r = zt(), i = [];
      if (t = {
        added: s,
        deleted: r,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(n).has(null)) {
        let c = null;
        const l = () => {
          c && i.push(c);
        };
        for (let a = n._start; a !== null; a = a.right)
          a.deleted ? this.deletes(a) && !this.adds(a) && ((c === null || c.delete === void 0) && (l(), c = { delete: 0 }), c.delete += a.length, r.add(a)) : this.adds(a) ? ((c === null || c.insert === void 0) && (l(), c = { insert: [] }), c.insert = c.insert.concat(a.content.getContent()), s.add(a)) : ((c === null || c.retain === void 0) && (l(), c = { retain: 0 }), c.retain += a.length);
        c !== null && c.retain === void 0 && l();
      }
      this._changes = t;
    }
    return (
      /** @type {any} */
      t
    );
  }
}
const Uh = (e, t) => {
  const n = [];
  for (; t._item !== null && t !== e; ) {
    if (t._item.parentSub !== null)
      n.unshift(t._item.parentSub);
    else {
      let s = 0, r = (
        /** @type {AbstractType<any>} */
        t._item.parent._start
      );
      for (; r !== t._item && r !== null; )
        !r.deleted && r.countable && (s += r.length), r = r.right;
      n.unshift(s);
    }
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  }
  return n;
}, Wo = 80;
let Cr = 0;
class Ph {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(t, n) {
    t.marker = !0, this.p = t, this.index = n, this.timestamp = Cr++;
  }
}
const Bh = (e) => {
  e.timestamp = Cr++;
}, Xo = (e, t, n) => {
  e.p.marker = !1, e.p = t, t.marker = !0, e.index = n, e.timestamp = Cr++;
}, jh = (e, t, n) => {
  if (e.length >= Wo) {
    const s = e.reduce((r, i) => r.timestamp < i.timestamp ? r : i);
    return Xo(s, t, n), s;
  } else {
    const s = new Ph(t, n);
    return e.push(s), s;
  }
}, Jn = (e, t) => {
  if (e._start === null || t === 0 || e._searchMarker === null)
    return null;
  const n = e._searchMarker.length === 0 ? null : e._searchMarker.reduce((i, o) => wn(t - i.index) < wn(t - o.index) ? i : o);
  let s = e._start, r = 0;
  for (n !== null && (s = n.p, r = n.index, Bh(n)); s.right !== null && r < t; ) {
    if (!s.deleted && s.countable) {
      if (t < r + s.length)
        break;
      r += s.length;
    }
    s = s.right;
  }
  for (; s.left !== null && r > t; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  for (; s.left !== null && s.left.id.client === s.id.client && s.left.id.clock + s.left.length === s.id.clock; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  return n !== null && wn(n.index - r) < /** @type {YText|YArray<any>} */
  s.parent.length / Wo ? (Xo(n, s, r), n) : jh(e._searchMarker, s, r);
}, Be = (e, t, n) => {
  for (let s = e.length - 1; s >= 0; s--) {
    const r = e[s];
    if (n > 0) {
      let i = r.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (r.index -= i.length);
      if (i === null || i.marker === !0) {
        e.splice(s, 1);
        continue;
      }
      r.p = i, i.marker = !0;
    }
    (t < r.index || n > 0 && t === r.index) && (r.index = ee(t, r.index + n));
  }
}, Zn = (e, t, n) => {
  const s = e, r = t.changedParentTypes;
  for (; Dt(r, e, () => []).push(n), e._item !== null; )
    e = /** @type {AbstractType<any>} */
    e._item.parent;
  Ho(s._eH, n, t);
};
class U {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = ai(), this._dEH = ai(), this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(t, n) {
    this.doc = t, this._item = n;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw pt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw pt();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(t) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let t = this._start;
    for (; t !== null && t.deleted; )
      t = t.right;
    return t;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, n) {
    !t.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(t) {
    hi(this._eH, t);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(t) {
    hi(this._dEH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(t) {
    ui(this._eH, t);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(t) {
    ui(this._dEH, t);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Jo = (e, t, n) => {
  t < 0 && (t = e._length + t), n < 0 && (n = e._length + n);
  let s = n - t;
  const r = [];
  let i = e._start;
  for (; i !== null && s > 0; ) {
    if (i.countable && !i.deleted) {
      const o = i.content.getContent();
      if (o.length <= t)
        t -= o.length;
      else {
        for (let c = t; c < o.length && s > 0; c++)
          r.push(o[c]), s--;
        t = 0;
      }
    }
    i = i.right;
  }
  return r;
}, Zo = (e) => {
  const t = [];
  let n = e._start;
  for (; n !== null; ) {
    if (n.countable && !n.deleted) {
      const s = n.content.getContent();
      for (let r = 0; r < s.length; r++)
        t.push(s[r]);
    }
    n = n.right;
  }
  return t;
}, je = (e, t) => {
  let n = 0, s = e._start;
  for (; s !== null; ) {
    if (s.countable && !s.deleted) {
      const r = s.content.getContent();
      for (let i = 0; i < r.length; i++)
        t(r[i], n++, e);
    }
    s = s.right;
  }
}, qo = (e, t) => {
  const n = [];
  return je(e, (s, r) => {
    n.push(t(s, r, e));
  }), n;
}, zh = (e) => {
  let t = e._start, n = null, s = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (n === null) {
        for (; t !== null && t.deleted; )
          t = t.right;
        if (t === null)
          return {
            done: !0,
            value: void 0
          };
        n = t.content.getContent(), s = 0, t = t.right;
      }
      const r = n[s++];
      return n.length <= s && (n = null), {
        done: !1,
        value: r
      };
    }
  };
}, Qo = (e, t) => {
  const n = Jn(e, t);
  let s = e._start;
  for (n !== null && (s = n.p, t -= n.index); s !== null; s = s.right)
    if (!s.deleted && s.countable) {
      if (t < s.length)
        return s.content.getContent()[t];
      t -= s.length;
    }
}, Mn = (e, t, n, s) => {
  let r = n;
  const i = e.doc, o = i.clientID, c = i.store, l = n === null ? t._start : n.right;
  let a = [];
  const h = () => {
    a.length > 0 && (r = new z(_(o, Y(c, o)), r, r && r.lastId, l, l && l.id, t, null, new qt(a)), r.integrate(e, 0), a = []);
  };
  s.forEach((u) => {
    if (u === null)
      a.push(u);
    else
      switch (u.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          a.push(u);
          break;
        default:
          switch (h(), u.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              r = new z(_(o, Y(c, o)), r, r && r.lastId, l, l && l.id, t, null, new qe(new Uint8Array(
                /** @type {Uint8Array} */
                u
              ))), r.integrate(e, 0);
              break;
            case mt:
              r = new z(_(o, Y(c, o)), r, r && r.lastId, l, l && l.id, t, null, new Qe(
                /** @type {Doc} */
                u
              )), r.integrate(e, 0);
              break;
            default:
              if (u instanceof U)
                r = new z(_(o, Y(c, o)), r, r && r.lastId, l, l && l.id, t, null, new Rt(u)), r.integrate(e, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), h();
}, tc = () => vt("Length exceeded!"), ec = (e, t, n, s) => {
  if (n > t._length)
    throw tc();
  if (n === 0)
    return t._searchMarker && Be(t._searchMarker, n, s.length), Mn(e, t, null, s);
  const r = n, i = Jn(t, n);
  let o = t._start;
  for (i !== null && (o = i.p, n -= i.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right)
    if (!o.deleted && o.countable) {
      if (n <= o.length) {
        n < o.length && Ft(e, _(o.id.client, o.id.clock + n));
        break;
      }
      n -= o.length;
    }
  return t._searchMarker && Be(t._searchMarker, r, s.length), Mn(e, t, o, s);
}, Fh = (e, t, n) => {
  let r = (t._searchMarker || []).reduce((i, o) => o.index > i.index ? o : i, { index: 0, p: t._start }).p;
  if (r)
    for (; r.right; )
      r = r.right;
  return Mn(e, t, r, n);
}, nc = (e, t, n, s) => {
  if (s === 0)
    return;
  const r = n, i = s, o = Jn(t, n);
  let c = t._start;
  for (o !== null && (c = o.p, n -= o.index); c !== null && n > 0; c = c.right)
    !c.deleted && c.countable && (n < c.length && Ft(e, _(c.id.client, c.id.clock + n)), n -= c.length);
  for (; s > 0 && c !== null; )
    c.deleted || (s < c.length && Ft(e, _(c.id.client, c.id.clock + s)), c.delete(e), s -= c.length), c = c.right;
  if (s > 0)
    throw tc();
  t._searchMarker && Be(
    t._searchMarker,
    r,
    -i + s
    /* in case we remove the above exception */
  );
}, In = (e, t, n) => {
  const s = t._map.get(n);
  s !== void 0 && s.delete(e);
}, vr = (e, t, n, s) => {
  const r = t._map.get(n) || null, i = e.doc, o = i.clientID;
  let c;
  if (s == null)
    c = new qt([s]);
  else
    switch (s.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        c = new qt([s]);
        break;
      case Uint8Array:
        c = new qe(
          /** @type {Uint8Array} */
          s
        );
        break;
      case mt:
        c = new Qe(
          /** @type {Doc} */
          s
        );
        break;
      default:
        if (s instanceof U)
          c = new Rt(s);
        else
          throw new Error("Unexpected content type");
    }
  new z(_(o, Y(i.store, o)), r, r && r.lastId, null, null, t, n, c).integrate(e, 0);
}, Ar = (e, t) => {
  const n = e._map.get(t);
  return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, sc = (e) => {
  const t = {};
  return e._map.forEach((n, s) => {
    n.deleted || (t[s] = n.content.getContent()[n.length - 1]);
  }), t;
}, rc = (e, t) => {
  const n = e._map.get(t);
  return n !== void 0 && !n.deleted;
}, Hh = (e, t) => {
  const n = {};
  return e._map.forEach((s, r) => {
    let i = s;
    for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && oe(i, t) && (n[r] = i.content.getContent()[i.length - 1]);
  }), n;
}, hn = (e) => rh(
  e.entries(),
  /** @param {any} entry */
  (t) => !t[1].deleted
);
class Vh extends Xn {
}
class xt extends U {
  constructor() {
    super(), this._prelimContent = [], this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(t) {
    const n = new xt();
    return n.push(t), n;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, n) {
    super._integrate(t, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new xt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const t = new xt();
    return t.insert(0, this.toArray().map(
      (n) => n instanceof U ? (
        /** @type {typeof el} */
        n.clone()
      ) : n
    )), t;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, n) {
    super._callObserver(t, n), Zn(this, t, new Vh(this, t));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(t, n) {
    this.doc !== null ? T(this.doc, (s) => {
      ec(
        s,
        this,
        t,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.splice(t, 0, ...n);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(t) {
    this.doc !== null ? T(this.doc, (n) => {
      Fh(
        n,
        this,
        /** @type {any} */
        t
      );
    }) : this._prelimContent.push(...t);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(t) {
    this.insert(0, t);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(t, n = 1) {
    this.doc !== null ? T(this.doc, (s) => {
      nc(s, this, t, n);
    }) : this._prelimContent.splice(t, n);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(t) {
    return Qo(this, t);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Zo(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(t = 0, n = this.length) {
    return Jo(this, t, n);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((t) => t instanceof U ? t.toJSON() : t);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(t) {
    return qo(
      this,
      /** @type {any} */
      t
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    je(this, t);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return zh(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(fu);
  }
}
const $h = (e) => new xt();
class Yh extends Xn {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(t, n, s) {
    super(t, n), this.keysChanged = s;
  }
}
class At extends U {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(t) {
    super(), this._prelimContent = null, t === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(t);
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, n) {
    super._integrate(t, n), this._prelimContent.forEach((s, r) => {
      this.set(r, s);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new At();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const t = new At();
    return this.forEach((n, s) => {
      t.set(s, n instanceof U ? (
        /** @type {typeof value} */
        n.clone()
      ) : n);
    }), t;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, n) {
    Zn(this, t, new Yh(this, t, n));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    const t = {};
    return this._map.forEach((n, s) => {
      if (!n.deleted) {
        const r = n.content.getContent()[n.length - 1];
        t[s] = r instanceof U ? r.toJSON() : r;
      }
    }), t;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...hn(this._map)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return ms(
      hn(this._map),
      /** @param {any} v */
      (t) => t[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return ms(
      hn(this._map),
      /** @param {any} v */
      (t) => t[1].content.getContent()[t[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return ms(
      hn(this._map),
      /** @param {any} v */
      (t) => (
        /** @type {any} */
        [t[0], t[1].content.getContent()[t[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    this._map.forEach((n, s) => {
      n.deleted || t(n.content.getContent()[n.length - 1], s, this);
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(t) {
    this.doc !== null ? T(this.doc, (n) => {
      In(n, this, t);
    }) : this._prelimContent.delete(t);
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(t, n) {
    return this.doc !== null ? T(this.doc, (s) => {
      vr(
        s,
        this,
        t,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.set(t, n), n;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(t) {
    return (
      /** @type {any} */
      Ar(this, t)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(t) {
    return rc(this, t);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? T(this.doc, (t) => {
      this.forEach(function(n, s, r) {
        In(t, r, s);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(pu);
  }
}
const Kh = (e) => new At(), Bt = (e, t) => e === t || typeof e == "object" && typeof t == "object" && e && t && xl(e, t);
class Ns {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(t, n, s, r) {
    this.left = t, this.right = n, this.index = s, this.currentAttributes = r;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    this.right === null && ut(), this.right.content.constructor === H ? this.right.deleted || xe(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const yi = (e, t, n) => {
  for (; t.right !== null && n > 0; )
    t.right.content.constructor === H ? t.right.deleted || xe(
      t.currentAttributes,
      /** @type {ContentFormat} */
      t.right.content
    ) : t.right.deleted || (n < t.right.length && Ft(e, _(t.right.id.client, t.right.id.clock + n)), t.index += t.right.length, n -= t.right.length), t.left = t.right, t.right = t.right.right;
  return t;
}, un = (e, t, n, s) => {
  const r = /* @__PURE__ */ new Map(), i = s ? Jn(t, n) : null;
  if (i) {
    const o = new Ns(i.p.left, i.p, i.index, r);
    return yi(e, o, n - i.index);
  } else {
    const o = new Ns(null, t._start, 0, r);
    return yi(e, o, n);
  }
}, ic = (e, t, n, s) => {
  for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === H && Bt(
    s.get(
      /** @type {ContentFormat} */
      n.right.content.key
    ),
    /** @type {ContentFormat} */
    n.right.content.value
  )); )
    n.right.deleted || s.delete(
      /** @type {ContentFormat} */
      n.right.content.key
    ), n.forward();
  const r = e.doc, i = r.clientID;
  s.forEach((o, c) => {
    const l = n.left, a = n.right, h = new z(_(i, Y(r.store, i)), l, l && l.lastId, a, a && a.id, t, null, new H(c, o));
    h.integrate(e, 0), n.right = h, n.forward();
  });
}, xe = (e, t) => {
  const { key: n, value: s } = t;
  s === null ? e.delete(n) : e.set(n, s);
}, oc = (e, t) => {
  for (; e.right !== null; ) {
    if (!(e.right.deleted || e.right.content.constructor === H && Bt(
      t[
        /** @type {ContentFormat} */
        e.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      e.right.content.value
    ))) break;
    e.forward();
  }
}, cc = (e, t, n, s) => {
  const r = e.doc, i = r.clientID, o = /* @__PURE__ */ new Map();
  for (const c in s) {
    const l = s[c], a = n.currentAttributes.get(c) ?? null;
    if (!Bt(a, l)) {
      o.set(c, a);
      const { left: h, right: u } = n;
      n.right = new z(_(i, Y(r.store, i)), h, h && h.lastId, u, u && u.id, t, null, new H(c, l)), n.right.integrate(e, 0), n.forward();
    }
  }
  return o;
}, bs = (e, t, n, s, r) => {
  n.currentAttributes.forEach((d, f) => {
    r[f] === void 0 && (r[f] = null);
  });
  const i = e.doc, o = i.clientID;
  oc(n, r);
  const c = cc(e, t, n, r), l = s.constructor === String ? new Et(
    /** @type {string} */
    s
  ) : s instanceof U ? new Rt(s) : new ne(s);
  let { left: a, right: h, index: u } = n;
  t._searchMarker && Be(t._searchMarker, n.index, l.getLength()), h = new z(_(o, Y(i.store, o)), a, a && a.lastId, h, h && h.id, t, null, l), h.integrate(e, 0), n.right = h, n.index = u, n.forward(), ic(e, t, n, c);
}, mi = (e, t, n, s, r) => {
  const i = e.doc, o = i.clientID;
  oc(n, r);
  const c = cc(e, t, n, r);
  t: for (; n.right !== null && (s > 0 || c.size > 0 && (n.right.deleted || n.right.content.constructor === H)); ) {
    if (!n.right.deleted)
      switch (n.right.content.constructor) {
        case H: {
          const { key: l, value: a } = (
            /** @type {ContentFormat} */
            n.right.content
          ), h = r[l];
          if (h !== void 0) {
            if (Bt(h, a))
              c.delete(l);
            else {
              if (s === 0)
                break t;
              c.set(l, a);
            }
            n.right.delete(e);
          } else
            n.currentAttributes.set(l, a);
          break;
        }
        default:
          s < n.right.length && Ft(e, _(n.right.id.client, n.right.id.clock + s)), s -= n.right.length;
          break;
      }
    n.forward();
  }
  if (s > 0) {
    let l = "";
    for (; s > 0; s--)
      l += `
`;
    n.right = new z(_(o, Y(i.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, t, null, new Et(l)), n.right.integrate(e, 0), n.forward();
  }
  ic(e, t, n, c);
}, lc = (e, t, n, s, r) => {
  let i = t;
  const o = tt();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === H) {
      const a = (
        /** @type {ContentFormat} */
        i.content
      );
      o.set(a.key, a);
    }
    i = i.right;
  }
  let c = 0, l = !1;
  for (; t !== i; ) {
    if (n === t && (l = !0), !t.deleted) {
      const a = t.content;
      if (a.constructor === H) {
        const { key: h, value: u } = (
          /** @type {ContentFormat} */
          a
        ), d = s.get(h) ?? null;
        (o.get(h) !== a || d === u) && (t.delete(e), c++, !l && (r.get(h) ?? null) === u && d !== u && (d === null ? r.delete(h) : r.set(h, d))), !l && !t.deleted && xe(
          r,
          /** @type {ContentFormat} */
          a
        );
      }
    }
    t = /** @type {Item} */
    t.right;
  }
  return c;
}, Gh = (e, t) => {
  for (; t && t.right && (t.right.deleted || !t.right.countable); )
    t = t.right;
  const n = /* @__PURE__ */ new Set();
  for (; t && (t.deleted || !t.countable); ) {
    if (!t.deleted && t.content.constructor === H) {
      const s = (
        /** @type {ContentFormat} */
        t.content.key
      );
      n.has(s) ? t.delete(e) : n.add(s);
    }
    t = t.left;
  }
}, Wh = (e) => {
  let t = 0;
  return T(
    /** @type {Doc} */
    e.doc,
    (n) => {
      let s = (
        /** @type {Item} */
        e._start
      ), r = e._start, i = tt();
      const o = ks(i);
      for (; r; )
        r.deleted === !1 && (r.content.constructor === H ? xe(
          o,
          /** @type {ContentFormat} */
          r.content
        ) : (t += lc(n, s, r, i, o), i = ks(o), s = r)), r = r.right;
    }
  ), t;
}, Xh = (e) => {
  const t = /* @__PURE__ */ new Set(), n = e.doc;
  for (const [s, r] of e.afterState.entries()) {
    const i = e.beforeState.get(s) || 0;
    r !== i && Yo(
      e,
      /** @type {Array<Item|GC>} */
      n.store.clients.get(s),
      i,
      r,
      (o) => {
        !o.deleted && /** @type {Item} */
        o.content.constructor === H && o.constructor !== nt && t.add(
          /** @type {any} */
          o.parent
        );
      }
    );
  }
  T(n, (s) => {
    To(e, e.deleteSet, (r) => {
      if (r instanceof nt || !/** @type {YText} */
      r.parent._hasFormatting || t.has(
        /** @type {YText} */
        r.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        r.parent
      );
      r.content.constructor === H ? t.add(i) : Gh(s, r);
    });
    for (const r of t)
      Wh(r);
  });
}, wi = (e, t, n) => {
  const s = n, r = ks(t.currentAttributes), i = t.right;
  for (; n > 0 && t.right !== null; ) {
    if (t.right.deleted === !1)
      switch (t.right.content.constructor) {
        case Rt:
        case ne:
        case Et:
          n < t.right.length && Ft(e, _(t.right.id.client, t.right.id.clock + n)), n -= t.right.length, t.right.delete(e);
          break;
      }
    t.forward();
  }
  i && lc(e, i, t.right, r, t.currentAttributes);
  const o = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (t.left || t.right).parent
  );
  return o._searchMarker && Be(o._searchMarker, t.index, -s + n), t;
};
class Jh extends Xn {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(t, n, s) {
    super(t, n), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), s.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.keysChanged.add(r);
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const t = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = t;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const t = (
        /** @type {Doc} */
        this.target.doc
      ), n = [];
      T(t, (s) => {
        const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
        let o = this.target._start, c = null;
        const l = {};
        let a = "", h = 0, u = 0;
        const d = () => {
          if (c !== null) {
            let f = null;
            switch (c) {
              case "delete":
                u > 0 && (f = { delete: u }), u = 0;
                break;
              case "insert":
                (typeof a == "object" || a.length > 0) && (f = { insert: a }, r.size > 0 && (f.attributes = {}, r.forEach((p, g) => {
                  p !== null && (f.attributes[g] = p);
                }))), a = "";
                break;
              case "retain":
                h > 0 && (f = { retain: h }, bl(l) || (f.attributes = gl({}, l))), h = 0;
                break;
            }
            f && n.push(f), c = null;
          }
        };
        for (; o !== null; ) {
          switch (o.content.constructor) {
            case Rt:
            case ne:
              this.adds(o) ? this.deletes(o) || (d(), c = "insert", a = o.content.getContent()[0], d()) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), u += 1) : o.deleted || (c !== "retain" && (d(), c = "retain"), h += 1);
              break;
            case Et:
              this.adds(o) ? this.deletes(o) || (c !== "insert" && (d(), c = "insert"), a += /** @type {ContentString} */
              o.content.str) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), u += o.length) : o.deleted || (c !== "retain" && (d(), c = "retain"), h += o.length);
              break;
            case H: {
              const { key: f, value: p } = (
                /** @type {ContentFormat} */
                o.content
              );
              if (this.adds(o)) {
                if (!this.deletes(o)) {
                  const g = r.get(f) ?? null;
                  Bt(g, p) ? p !== null && o.delete(s) : (c === "retain" && d(), Bt(p, i.get(f) ?? null) ? delete l[f] : l[f] = p);
                }
              } else if (this.deletes(o)) {
                i.set(f, p);
                const g = r.get(f) ?? null;
                Bt(g, p) || (c === "retain" && d(), l[f] = g);
              } else if (!o.deleted) {
                i.set(f, p);
                const g = l[f];
                g !== void 0 && (Bt(g, p) ? g !== null && o.delete(s) : (c === "retain" && d(), p === null ? delete l[f] : l[f] = p));
              }
              o.deleted || (c === "insert" && d(), xe(
                r,
                /** @type {ContentFormat} */
                o.content
              ));
              break;
            }
          }
          o = o.right;
        }
        for (d(); n.length > 0; ) {
          const f = n[n.length - 1];
          if (f.retain !== void 0 && f.attributes === void 0)
            n.pop();
          else
            break;
        }
      }), this._delta = n;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class Lt extends U {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(t) {
    super(), this._pending = t !== void 0 ? [() => this.insert(0, t)] : [], this._searchMarker = [], this._hasFormatting = !1;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(t, n) {
    super._integrate(t, n);
    try {
      this._pending.forEach((s) => s());
    } catch (s) {
      console.error(s);
    }
    this._pending = null;
  }
  _copy() {
    return new Lt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const t = new Lt();
    return t.applyDelta(this.toDelta()), t;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, n) {
    super._callObserver(t, n);
    const s = new Jh(this, t, n);
    Zn(this, t, s), !t.local && this._hasFormatting && (t._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    let t = "", n = this._start;
    for (; n !== null; )
      !n.deleted && n.countable && n.content.constructor === Et && (t += /** @type {ContentString} */
      n.content.str), n = n.right;
    return t;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(t, { sanitize: n = !0 } = {}) {
    this.doc !== null ? T(this.doc, (s) => {
      const r = new Ns(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < t.length; i++) {
        const o = t[i];
        if (o.insert !== void 0) {
          const c = !n && typeof o.insert == "string" && i === t.length - 1 && r.right === null && o.insert.slice(-1) === `
` ? o.insert.slice(0, -1) : o.insert;
          (typeof c != "string" || c.length > 0) && bs(s, this, r, c, o.attributes || {});
        } else o.retain !== void 0 ? mi(s, this, r, o.retain, o.attributes || {}) : o.delete !== void 0 && wi(s, r, o.delete);
      }
    }) : this._pending.push(() => this.applyDelta(t));
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(t, n, s) {
    const r = [], i = /* @__PURE__ */ new Map(), o = (
      /** @type {Doc} */
      this.doc
    );
    let c = "", l = this._start;
    function a() {
      if (c.length > 0) {
        const u = {};
        let d = !1;
        i.forEach((p, g) => {
          d = !0, u[g] = p;
        });
        const f = { insert: c };
        d && (f.attributes = u), r.push(f), c = "";
      }
    }
    const h = () => {
      for (; l !== null; ) {
        if (oe(l, t) || n !== void 0 && oe(l, n))
          switch (l.content.constructor) {
            case Et: {
              const u = i.get("ychange");
              t !== void 0 && !oe(l, t) ? (u === void 0 || u.user !== l.id.client || u.type !== "removed") && (a(), i.set("ychange", s ? s("removed", l.id) : { type: "removed" })) : n !== void 0 && !oe(l, n) ? (u === void 0 || u.user !== l.id.client || u.type !== "added") && (a(), i.set("ychange", s ? s("added", l.id) : { type: "added" })) : u !== void 0 && (a(), i.delete("ychange")), c += /** @type {ContentString} */
              l.content.str;
              break;
            }
            case Rt:
            case ne: {
              a();
              const u = {
                insert: l.content.getContent()[0]
              };
              if (i.size > 0) {
                const d = (
                  /** @type {Object<string,any>} */
                  {}
                );
                u.attributes = d, i.forEach((f, p) => {
                  d[p] = f;
                });
              }
              r.push(u);
              break;
            }
            case H:
              oe(l, t) && (a(), xe(
                i,
                /** @type {ContentFormat} */
                l.content
              ));
              break;
          }
        l = l.right;
      }
      a();
    };
    return t || n ? T(o, (u) => {
      t && Os(u, t), n && Os(u, n), h();
    }, "cleanup") : h(), r;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(t, n, s) {
    if (n.length <= 0)
      return;
    const r = this.doc;
    r !== null ? T(r, (i) => {
      const o = un(i, this, t, !s);
      s || (s = {}, o.currentAttributes.forEach((c, l) => {
        s[l] = c;
      })), bs(i, this, o, n, s);
    }) : this._pending.push(() => this.insert(t, n, s));
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(t, n, s) {
    const r = this.doc;
    r !== null ? T(r, (i) => {
      const o = un(i, this, t, !s);
      bs(i, this, o, n, s || {});
    }) : this._pending.push(() => this.insertEmbed(t, n, s || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(t, n) {
    if (n === 0)
      return;
    const s = this.doc;
    s !== null ? T(s, (r) => {
      wi(r, un(r, this, t, !0), n);
    }) : this._pending.push(() => this.delete(t, n));
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(t, n, s) {
    if (n === 0)
      return;
    const r = this.doc;
    r !== null ? T(r, (i) => {
      const o = un(i, this, t, !1);
      o.right !== null && mi(i, this, o, n, s);
    }) : this._pending.push(() => this.format(t, n, s));
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(t) {
    this.doc !== null ? T(this.doc, (n) => {
      In(n, this, t);
    }) : this._pending.push(() => this.removeAttribute(t));
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(t, n) {
    this.doc !== null ? T(this.doc, (s) => {
      vr(s, this, t, n);
    }) : this._pending.push(() => this.setAttribute(t, n));
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(t) {
    return (
      /** @type {any} */
      Ar(this, t)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return sc(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(gu);
  }
}
const Zh = (e) => new Lt();
class xs {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(t, n = () => !0) {
    this._filter = n, this._root = t, this._currentNode = /** @type {Item} */
    t._start, this._firstCall = !0;
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let t = this._currentNode, n = t && t.content && /** @type {any} */
    t.content.type;
    if (t !== null && (!this._firstCall || t.deleted || !this._filter(n)))
      do
        if (n = /** @type {any} */
        t.content.type, !t.deleted && (n.constructor === Tt || n.constructor === St) && n._start !== null)
          t = n._start;
        else
          for (; t !== null; )
            if (t.right !== null) {
              t = t.right;
              break;
            } else t.parent === this._root ? t = null : t = /** @type {AbstractType<any>} */
            t.parent._item;
      while (t !== null && (t.deleted || !this._filter(
        /** @type {ContentType} */
        t.content.type
      )));
    return this._firstCall = !1, t === null ? { value: void 0, done: !0 } : (this._currentNode = t, { value: (
      /** @type {any} */
      t.content.type
    ), done: !1 });
  }
}
class St extends U {
  constructor() {
    super(), this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const t = this._first;
    return t ? t.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, n) {
    super._integrate(t, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new St();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const t = new St();
    return t.insert(0, this.toArray().map((n) => n instanceof U ? n.clone() : n)), t;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(t) {
    return new xs(this, t);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(t) {
    t = t.toUpperCase();
    const s = new xs(this, (r) => r.nodeName && r.nodeName.toUpperCase() === t).next();
    return s.done ? null : s.value;
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(t) {
    return t = t.toUpperCase(), It(new xs(this, (n) => n.nodeName && n.nodeName.toUpperCase() === t));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(t, n) {
    Zn(this, t, new tu(this, n, t));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return qo(this, (t) => t.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, n = {}, s) {
    const r = t.createDocumentFragment();
    return s !== void 0 && s._createAssociation(r, this), je(this, (i) => {
      r.insertBefore(i.toDOM(t, n, s), null);
    }), r;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(t, n) {
    this.doc !== null ? T(this.doc, (s) => {
      ec(s, this, t, n);
    }) : this._prelimContent.splice(t, 0, ...n);
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(t, n) {
    if (this.doc !== null)
      T(this.doc, (s) => {
        const r = t && t instanceof U ? t._item : t;
        Mn(s, this, r, n);
      });
    else {
      const s = (
        /** @type {Array<any>} */
        this._prelimContent
      ), r = t === null ? 0 : s.findIndex((i) => i === t) + 1;
      if (r === 0 && t !== null)
        throw vt("Reference item not found");
      s.splice(r, 0, ...n);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(t, n = 1) {
    this.doc !== null ? T(this.doc, (s) => {
      nc(s, this, t, n);
    }) : this._prelimContent.splice(t, n);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Zo(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(t) {
    this.insert(this.length, t);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(t) {
    this.insert(0, t);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(t) {
    return Qo(this, t);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(t = 0, n = this.length) {
    return Jo(this, t, n);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(t) {
    je(this, t);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(mu);
  }
}
const qh = (e) => new St();
class Tt extends St {
  constructor(t = "UNDEFINED") {
    super(), this.nodeName = t, this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const t = this._item ? this._item.next : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const t = this._item ? this._item.prev : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(t, n) {
    super._integrate(t, n), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((s, r) => {
      this.setAttribute(r, s);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new Tt(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const t = new Tt(this.nodeName), n = this.getAttributes();
    return ml(n, (s, r) => {
      typeof s == "string" && t.setAttribute(r, s);
    }), t.insert(0, this.toArray().map((s) => s instanceof U ? s.clone() : s)), t;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const t = this.getAttributes(), n = [], s = [];
    for (const c in t)
      s.push(c);
    s.sort();
    const r = s.length;
    for (let c = 0; c < r; c++) {
      const l = s[c];
      n.push(l + '="' + t[l] + '"');
    }
    const i = this.nodeName.toLocaleLowerCase(), o = n.length > 0 ? " " + n.join(" ") : "";
    return `<${i}${o}>${super.toString()}</${i}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(t) {
    this.doc !== null ? T(this.doc, (n) => {
      In(n, this, t);
    }) : this._prelimAttrs.delete(t);
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(t, n) {
    this.doc !== null ? T(this.doc, (s) => {
      vr(s, this, t, n);
    }) : this._prelimAttrs.set(t, n);
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(t) {
    return (
      /** @type {any} */
      Ar(this, t)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(t) {
    return (
      /** @type {any} */
      rc(this, t)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(t) {
    return (
      /** @type {any} */
      t ? Hh(this, t) : sc(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, n = {}, s) {
    const r = t.createElement(this.nodeName), i = this.getAttributes();
    for (const o in i) {
      const c = i[o];
      typeof c == "string" && r.setAttribute(o, c);
    }
    return je(this, (o) => {
      r.appendChild(o.toDOM(t, n, s));
    }), s !== void 0 && s._createAssociation(r, this), r;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(yu), t.writeKey(this.nodeName);
  }
}
const Qh = (e) => new Tt(e.readKey());
class tu extends Xn {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor(t, n, s) {
    super(t, s), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), n.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.attributesChanged.add(r);
    });
  }
}
class ye extends At {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(t) {
    super(), this.hookName = t;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new ye(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const t = new ye(this.hookName);
    return this.forEach((n, s) => {
      t.set(s, n);
    }), t;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, n = {}, s) {
    const r = n[this.hookName];
    let i;
    return r !== void 0 ? i = r.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), s !== void 0 && s._createAssociation(i, this), i;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(t) {
    t.writeTypeRef(wu), t.writeKey(this.hookName);
  }
}
const eu = (e) => new ye(e.readKey());
class Zt extends Lt {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const t = this._item ? this._item.next : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const t = this._item ? this._item.prev : null;
    return t ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      t.content.type
    ) : null;
  }
  _copy() {
    return new Zt();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const t = new Zt();
    return t.applyDelta(this.toDelta()), t;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(t = document, n, s) {
    const r = t.createTextNode(this.toString());
    return s !== void 0 && s._createAssociation(r, this), r;
  }
  toString() {
    return this.toDelta().map((t) => {
      const n = [];
      for (const r in t.attributes) {
        const i = [];
        for (const o in t.attributes[r])
          i.push({ key: o, value: t.attributes[r][o] });
        i.sort((o, c) => o.key < c.key ? -1 : 1), n.push({ nodeName: r, attrs: i });
      }
      n.sort((r, i) => r.nodeName < i.nodeName ? -1 : 1);
      let s = "";
      for (let r = 0; r < n.length; r++) {
        const i = n[r];
        s += `<${i.nodeName}`;
        for (let o = 0; o < i.attrs.length; o++) {
          const c = i.attrs[o];
          s += ` ${c.key}="${c.value}"`;
        }
        s += ">";
      }
      s += t.insert;
      for (let r = n.length - 1; r >= 0; r--)
        s += `</${n[r].nodeName}>`;
      return s;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(t) {
    t.writeTypeRef(bu);
  }
}
const nu = (e) => new Zt();
class Sr {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(t, n) {
    this.id = t, this.length = n;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw pt();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(t, n, s) {
    throw pt();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, n) {
    throw pt();
  }
}
const su = 0;
class nt extends Sr {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.constructor !== t.constructor ? !1 : (this.length += t.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, n) {
    n > 0 && (this.id.clock += n, this.length -= n), $o(t.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeInfo(su), t.writeLen(this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, n) {
    return null;
  }
}
class qe {
  /**
   * @param {Uint8Array} content
   */
  constructor(t) {
    this.content = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new qe(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(t) {
    throw pt();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const ru = (e) => new qe(e.readBuf());
class ze {
  /**
   * @param {number} len
   */
  constructor(t) {
    this.len = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new ze(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(t) {
    const n = new ze(this.len - t);
    return this.len = t, n;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.len += t.len, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
    Dn(t.deleteSet, n.id.client, n.id.clock, this.len), n.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeLen(this.len - n);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const iu = (e) => new ze(e.readLen()), ac = (e, t) => new mt({ guid: e, ...t, shouldLoad: t.shouldLoad || t.autoLoad || !1 });
class Qe {
  /**
   * @param {Doc} doc
   */
  constructor(t) {
    t._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = t;
    const n = {};
    this.opts = n, t.gc || (n.gc = !1), t.autoLoad && (n.autoLoad = !0), t.meta !== null && (n.meta = t.meta);
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new Qe(ac(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(t) {
    throw pt();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
    this.doc._item = n, t.subdocsAdded.add(this.doc), this.doc.shouldLoad && t.subdocsLoaded.add(this.doc);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
    t.subdocsAdded.has(this.doc) ? t.subdocsAdded.delete(this.doc) : t.subdocsRemoved.add(this.doc);
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeString(this.doc.guid), t.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const ou = (e) => new Qe(ac(e.readString(), e.readAny()));
class ne {
  /**
   * @param {Object} embed
   */
  constructor(t) {
    this.embed = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new ne(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(t) {
    throw pt();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const cu = (e) => new ne(e.readJSON());
class H {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(t, n) {
    this.key = t, this.value = n;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new H(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(t) {
    throw pt();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(t, n) {
    const s = (
      /** @type {YText} */
      n.parent
    );
    s._searchMarker = null, s._hasFormatting = !0;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeKey(this.key), t.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const lu = (e) => new H(e.readKey(), e.readJSON());
class Ln {
  /**
   * @param {Array<any>} arr
   */
  constructor(t) {
    this.arr = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new Ln(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(t) {
    const n = new Ln(this.arr.slice(t));
    return this.arr = this.arr.slice(0, t), n;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.arr = this.arr.concat(t.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    const s = this.arr.length;
    t.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      t.writeString(i === void 0 ? "undefined" : JSON.stringify(i));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const au = (e) => {
  const t = e.readLen(), n = [];
  for (let s = 0; s < t; s++) {
    const r = e.readString();
    r === "undefined" ? n.push(void 0) : n.push(JSON.parse(r));
  }
  return new Ln(n);
};
class qt {
  /**
   * @param {Array<any>} arr
   */
  constructor(t) {
    this.arr = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new qt(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(t) {
    const n = new qt(this.arr.slice(t));
    return this.arr = this.arr.slice(0, t), n;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.arr = this.arr.concat(t.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    const s = this.arr.length;
    t.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      t.writeAny(i);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const hu = (e) => {
  const t = e.readLen(), n = [];
  for (let s = 0; s < t; s++)
    n.push(e.readAny());
  return new qt(n);
};
class Et {
  /**
   * @param {string} str
   */
  constructor(t) {
    this.str = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new Et(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(t) {
    const n = new Et(this.str.slice(t));
    this.str = this.str.slice(0, t);
    const s = this.str.charCodeAt(t - 1);
    return s >= 55296 && s <= 56319 && (this.str = this.str.slice(0, t - 1) + "�", n.str = "�" + n.str.slice(1)), n;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.str += t.str, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeString(n === 0 ? this.str : this.str.slice(n));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const uu = (e) => new Et(e.readString()), du = [
  $h,
  Kh,
  Zh,
  Qh,
  qh,
  eu,
  nu
], fu = 0, pu = 1, gu = 2, yu = 3, mu = 4, wu = 5, bu = 6;
class Rt {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(t) {
    this.type = t;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new Rt(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(t) {
    throw pt();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(t) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(t, n) {
    this.type._integrate(t.doc, n);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(t) {
    let n = this.type._start;
    for (; n !== null; )
      n.deleted ? n.id.clock < (t.beforeState.get(n.id.client) || 0) && t._mergeStructs.push(n) : n.delete(t), n = n.right;
    this.type._map.forEach((s) => {
      s.deleted ? s.id.clock < (t.beforeState.get(s.id.client) || 0) && t._mergeStructs.push(s) : s.delete(t);
    }), t.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(t) {
    let n = this.type._start;
    for (; n !== null; )
      n.gc(t, !0), n = n.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (s) => {
        for (; s !== null; )
          s.gc(t, !0), s = s.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    this.type._write(t);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const xu = (e) => new Rt(du[e.readTypeRef()](e)), Tn = (e, t, n) => {
  const { client: s, clock: r } = t.id, i = new z(
    _(s, r + n),
    t,
    _(s, r + n - 1),
    t.right,
    t.rightOrigin,
    t.parent,
    t.parentSub,
    t.content.splice(n)
  );
  return t.deleted && i.markDeleted(), t.keep && (i.keep = !0), t.redone !== null && (i.redone = _(t.redone.client, t.redone.clock + n)), t.right = i, i.right !== null && (i.right.left = i), e._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), t.length = n, i;
};
class z extends Sr {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(t, n, s, r, i, o, c, l) {
    super(t, l.getLength()), this.origin = s, this.left = n, this.right = r, this.rightOrigin = i, this.parent = o, this.parentSub = c, this.redone = null, this.content = l, this.info = this.content.isCountable() ? qr : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(t) {
    (this.info & ds) > 0 !== t && (this.info ^= ds);
  }
  get marker() {
    return (this.info & ds) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & Zr) > 0;
  }
  set keep(t) {
    this.keep !== t && (this.info ^= Zr);
  }
  get countable() {
    return (this.info & qr) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & us) > 0;
  }
  set deleted(t) {
    this.deleted !== t && (this.info ^= us);
  }
  markDeleted() {
    this.info |= us;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, n) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= Y(n, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= Y(n, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === ae && this.id.client !== this.parent.client && this.parent.clock >= Y(n, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = di(t, n, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Ft(t, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === nt || this.right && this.right.constructor === nt)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === z && (this.parent = this.left.parent, this.parentSub = this.left.parentSub), this.right && this.right.constructor === z && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === ae) {
      const s = ws(n, this.parent);
      s.constructor === nt ? this.parent = null : this.parent = /** @type {ContentType} */
      s.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, n) {
    if (n > 0 && (this.id.clock += n, this.left = di(t, t.doc.store, _(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(n), this.length -= n), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let s = this.left, r;
        if (s !== null)
          r = s.right;
        else if (this.parentSub !== null)
          for (r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; r !== null && r.left !== null; )
            r = r.left;
        else
          r = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
        for (; r !== null && r !== this.right; ) {
          if (o.add(r), i.add(r), an(this.origin, r.origin)) {
            if (r.id.client < this.id.client)
              s = r, i.clear();
            else if (an(this.rightOrigin, r.rightOrigin))
              break;
          } else if (r.origin !== null && o.has(ws(t.doc.store, r.origin)))
            i.has(ws(t.doc.store, r.origin)) || (s = r, i.clear());
          else
            break;
          r = r.right;
        }
        this.left = s;
      }
      if (this.left !== null) {
        const s = this.left.right;
        this.right = s, this.left.right = this;
      } else {
        let s;
        if (this.parentSub !== null)
          for (s = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; s !== null && s.left !== null; )
            s = s.left;
        else
          s = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = s;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(t)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), $o(t.doc.store, this), this.content.integrate(t, this), pi(
        t,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(t);
    } else
      new nt(this.id, this.length).integrate(t, 0);
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let t = this.right;
    for (; t !== null && t.deleted; )
      t = t.right;
    return t;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let t = this.left;
    for (; t !== null && t.deleted; )
      t = t.left;
    return t;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : _(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(t) {
    if (this.constructor === t.constructor && an(t.origin, this.lastId) && this.right === t && an(this.rightOrigin, t.rightOrigin) && this.id.client === t.id.client && this.id.clock + this.length === t.id.clock && this.deleted === t.deleted && this.redone === null && t.redone === null && this.content.constructor === t.content.constructor && this.content.mergeWith(t.content)) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return n && n.forEach((s) => {
        s.p === t && (s.p = this, !this.deleted && this.countable && (s.index -= this.length));
      }), t.keep && (this.keep = !0), this.right = t.right, this.right !== null && (this.right.left = this), this.length += t.length, !0;
    }
    return !1;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(t) {
    if (!this.deleted) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (n._length -= this.length), this.markDeleted(), Dn(t.deleteSet, this.id.client, this.id.clock, this.length), pi(t, n, this.parentSub), this.content.delete(t);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(t, n) {
    if (!this.deleted)
      throw ut();
    this.content.gc(t), n ? kh(t, this, new nt(this.id, this.length)) : this.content = new ze(this.length);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(t, n) {
    const s = n > 0 ? _(this.id.client, this.id.clock + n - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, o = this.content.getRef() & jn | (s === null ? 0 : st) | // origin is defined
    (r === null ? 0 : Mt) | // right origin is defined
    (i === null ? 0 : Re);
    if (t.writeInfo(o), s !== null && t.writeLeftID(s), r !== null && t.writeRightID(r), s === null && r === null) {
      const c = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (c._item !== void 0) {
        const l = c._item;
        if (l === null) {
          const a = Sh(c);
          t.writeParentInfo(!0), t.writeString(a);
        } else
          t.writeParentInfo(!1), t.writeLeftID(l.id);
      } else c.constructor === String ? (t.writeParentInfo(!0), t.writeString(c)) : c.constructor === ae ? (t.writeParentInfo(!1), t.writeLeftID(c)) : ut();
      i !== null && t.writeString(i);
    }
    this.content.write(t, n);
  }
}
const hc = (e, t) => Cu[t & jn](e), Cu = [
  () => {
    ut();
  },
  // GC is not ItemContent
  iu,
  // 1
  au,
  // 2
  ru,
  // 3
  uu,
  // 4
  cu,
  // 5
  lu,
  // 6
  xu,
  // 7
  hu,
  // 8
  ou,
  // 9
  () => {
    ut();
  }
  // 10 - Skip is not ItemContent
], vu = 10;
class lt extends Sr {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(t) {
    return this.constructor !== t.constructor ? !1 : (this.length += t.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(t, n) {
    ut();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(t, n) {
    t.writeInfo(vu), b(t.restEncoder, this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(t, n) {
    return null;
  }
}
const uc = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), dc = "__ $YJS$ __";
uc[dc] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
uc[dc] = !0;
const Au = 0, Su = (e, t, n) => {
  A(e) === Au && n(t, jt(e));
}, Cs = 3e4;
class Eu extends lo {
  /**
   * @param {Y.Doc} doc
   */
  constructor(t) {
    super(), this.doc = t, this.clientID = t.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const n = Xt();
      this.getLocalState() !== null && Cs / 2 <= n - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const s = [];
      this.meta.forEach((r, i) => {
        i !== this.clientID && Cs <= n - r.lastUpdated && this.states.has(i) && s.push(i);
      }), s.length > 0 && Er(this, s, "timeout");
    }, gt(Cs / 10)), t.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(t) {
    const n = this.clientID, s = this.meta.get(n), r = s === void 0 ? 0 : s.clock + 1, i = this.states.get(n);
    t === null ? this.states.delete(n) : this.states.set(n, t), this.meta.set(n, {
      clock: r,
      lastUpdated: Xt()
    });
    const o = [], c = [], l = [], a = [];
    t === null ? a.push(n) : i == null ? t != null && o.push(n) : (c.push(n), ce(i, t) || l.push(n)), (o.length > 0 || l.length > 0 || a.length > 0) && this.emit("change", [{ added: o, updated: l, removed: a }, "local"]), this.emit("update", [{ added: o, updated: c, removed: a }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(t, n) {
    const s = this.getLocalState();
    s !== null && this.setLocalState({
      ...s,
      [t]: n
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const Er = (e, t, n) => {
  const s = [];
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    if (e.states.has(i)) {
      if (e.states.delete(i), i === e.clientID) {
        const o = (
          /** @type {MetaClientState} */
          e.meta.get(i)
        );
        e.meta.set(i, {
          clock: o.clock + 1,
          lastUpdated: Xt()
        });
      }
      s.push(i);
    }
  }
  s.length > 0 && (e.emit("change", [{ added: [], updated: [], removed: s }, n]), e.emit("update", [{ added: [], updated: [], removed: s }, n]));
}, Me = (e, t, n = e.states) => {
  const s = t.length, r = q();
  b(r, s);
  for (let i = 0; i < s; i++) {
    const o = t[i], c = n.get(o) || null, l = (
      /** @type {MetaClientState} */
      e.meta.get(o).clock
    );
    b(r, o), b(r, l), Kt(r, JSON.stringify(c));
  }
  return R(r);
}, ku = (e, t, n) => {
  const s = Ht(t), r = Xt(), i = [], o = [], c = [], l = [], a = A(s);
  for (let h = 0; h < a; h++) {
    const u = A(s);
    let d = A(s);
    const f = JSON.parse(jt(s)), p = e.meta.get(u), g = e.states.get(u), w = p === void 0 ? 0 : p.clock;
    (w < d || w === d && f === null && e.states.has(u)) && (f === null ? u === e.clientID && e.getLocalState() != null ? d++ : e.states.delete(u) : e.states.set(u, f), e.meta.set(u, {
      clock: d,
      lastUpdated: r
    }), p === void 0 && f !== null ? i.push(u) : p !== void 0 && f === null ? l.push(u) : f !== null && (ce(f, g) || c.push(u), o.push(u)));
  }
  (i.length > 0 || c.length > 0 || l.length > 0) && e.emit("change", [{
    added: i,
    updated: c,
    removed: l
  }, n]), (i.length > 0 || o.length > 0 || l.length > 0) && e.emit("update", [{
    added: i,
    updated: o,
    removed: l
  }, n]);
}, fc = 0, kr = 1, pc = 2, Us = (e, t) => {
  b(e, fc);
  const n = vh(t);
  B(e, n);
}, gc = (e, t, n) => {
  b(e, kr), B(e, wh(t, n));
}, Du = (e, t, n) => gc(t, n, Z(e)), yc = (e, t, n, s) => {
  try {
    gh(t, Z(e), n);
  } catch (r) {
    s?.(
      /** @type {Error} */
      r
    ), console.error("Caught error while handling a Yjs update", r);
  }
}, _u = (e, t) => {
  b(e, pc), B(e, t);
}, Mu = yc, Iu = (e, t, n, s, r) => {
  const i = A(e);
  switch (i) {
    case fc:
      Du(e, t, n);
      break;
    case kr:
      yc(e, n, s, r);
      break;
    case pc:
      Mu(e, n, s, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
var Vt = 0, mc = 3, he = 1, Lu = 2, Tu = typeof window > "u";
function Ou(e, t) {
  if (!e)
    throw new Error(t);
}
var tn = [];
tn[Vt] = (e, t, n, s, r) => {
  b(e, Vt);
  const i = Iu(
    t,
    e,
    n.doc,
    n
  );
  s && i === kr && !n.synced && (n.synced = !0);
};
tn[mc] = (e, t, n, s, r) => {
  b(e, he), B(
    e,
    Me(
      n.awareness,
      Array.from(n.awareness.getStates().keys())
    )
  );
};
tn[he] = (e, t, n, s, r) => {
  ku(
    n.awareness,
    Z(t),
    n
  );
};
tn[Lu] = (e, t, n, s, r) => {
  Su(
    t,
    n.doc,
    (i, o) => Ru(n, o)
  );
};
var bi = 3e4;
function Ru(e, t) {
  console.warn(`Permission denied to access ${e.url}.
${t}`);
}
function wc(e, t, n) {
  const s = Ht(t), r = q(), i = A(s), o = e.messageHandlers[i];
  return /** @type {any} */ o ? o(r, s, e, n, i) : console.error("Unable to compute message"), r;
}
function bc(e) {
  if (e.shouldConnect && e.ws === null) {
    if (!e._WS)
      throw new Error(
        "No WebSocket implementation available, did you forget to pass options.WebSocketPolyfill?"
      );
    const t = new e._WS(e.url);
    t.binaryType = "arraybuffer", e.ws = t, e.wsconnecting = !0, e.wsconnected = !1, e.synced = !1, t.addEventListener("message", (n) => {
      if (typeof n.data == "string")
        return;
      e.wsLastMessageReceived = Xt();
      const s = wc(e, new Uint8Array(n.data), !0);
      sr(s) > 1 && De(R(s), t);
    }), t.addEventListener("error", (n) => {
      e.emit("connection-error", [n, e]);
    }), t.addEventListener("close", (n) => {
      e.emit("connection-close", [n, e]), e.ws = null, e.wsconnecting = !1, e.wsconnected ? (e.wsconnected = !1, e.synced = !1, Er(
        e.awareness,
        Array.from(e.awareness.getStates().keys()).filter(
          (s) => s !== e.doc.clientID
        ),
        e
      ), e.emit("status", [
        {
          status: "disconnected"
        }
      ])) : e.wsUnsuccessfulReconnects++, setTimeout(
        bc,
        nr(
          Dl(2, e.wsUnsuccessfulReconnects) * 100,
          e.maxBackoffTime
        ),
        e
      );
    }), t.addEventListener("open", () => {
      e.wsLastMessageReceived = Xt(), e.wsconnecting = !1, e.wsconnected = !0, e.wsUnsuccessfulReconnects = 0, e.emit("status", [
        {
          status: "connected"
        }
      ]);
      const n = q();
      if (b(n, Vt), Us(n, e.doc), De(R(n), t), e.awareness.getLocalState() !== null) {
        const s = q();
        b(s, he), B(
          s,
          Me(e.awareness, [
            e.doc.clientID
          ])
        ), De(R(s), t);
      }
    }), e.emit("status", [
      {
        status: "connecting"
      }
    ]);
  }
}
function vs(e, t) {
  const n = e.ws;
  e.wsconnected && n && n.readyState === n.OPEN && De(t, n), e.bcconnected && ie(e.bcChannel, t, e);
}
var Nu = typeof WebSocket > "u" ? null : WebSocket, Uu = class extends lo {
  maxBackoffTime;
  bcChannel;
  url;
  roomname;
  doc;
  _WS;
  awareness;
  wsconnected;
  wsconnecting;
  bcconnected;
  disableBc;
  wsUnsuccessfulReconnects;
  messageHandlers;
  _synced;
  ws;
  wsLastMessageReceived;
  shouldConnect;
  // Whether to connect to other peers or not
  _resyncInterval;
  _bcSubscriber;
  _updateHandler;
  _awarenessUpdateHandler;
  _unloadHandler;
  _checkInterval;
  constructor(e, t, n, {
    connect: s = !0,
    awareness: r = new Eu(n),
    params: i = {},
    isPrefixedUrl: o = !1,
    WebSocketPolyfill: c = Nu,
    // Optionally provide a WebSocket polyfill
    resyncInterval: l = -1,
    // Request server state every `resyncInterval` milliseconds
    maxBackoffTime: a = 2500,
    // Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
    disableBc: h = Tu
    // Disable cross-tab BroadcastChannel communication
  } = {}) {
    for (super(); e[e.length - 1] === "/"; )
      e = e.slice(0, e.length - 1);
    const u = la(i);
    this.maxBackoffTime = a, this.bcChannel = e + "/" + t, this.url = o ? e : e + "/" + t + (u.length === 0 ? "" : "?" + u), this.roomname = t, this.doc = n, this._WS = c, this.awareness = r, this.wsconnected = !1, this.wsconnecting = !1, this.bcconnected = !1, this.disableBc = h, this.wsUnsuccessfulReconnects = 0, this.messageHandlers = tn.slice(), this._synced = !1, this.ws = null, this.wsLastMessageReceived = 0, this.shouldConnect = s, this._resyncInterval = 0, l > 0 && (this._resyncInterval = /** @type {any} */
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const d = q();
        b(d, Vt), Us(d, n), De(R(d), this.ws);
      }
    }, l)), this._bcSubscriber = (d, f) => {
      if (f !== this) {
        const p = wc(this, new Uint8Array(d), !1);
        sr(p) > 1 && ie(this.bcChannel, R(p), this);
      }
    }, this._updateHandler = (d, f) => {
      if (f !== this) {
        const p = q();
        b(p, Vt), _u(p, d), vs(this, R(p));
      }
    }, this.doc.on("update", this._updateHandler), this._awarenessUpdateHandler = ({ added: d, updated: f, removed: p }, g) => {
      const w = d.concat(f).concat(p), x = q();
      b(x, he), B(
        x,
        Me(r, w)
      ), vs(this, R(x));
    }, this._unloadHandler = () => {
      Er(
        this.awareness,
        [n.clientID],
        "window unload"
      );
    }, typeof window < "u" ? window.addEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.on == "function" && process.on("exit", this._unloadHandler), r.on("update", this._awarenessUpdateHandler), this._checkInterval = /** @type {any} */
    setInterval(() => {
      this.wsconnected && bi < Xt() - this.wsLastMessageReceived && (Ou(this.ws !== null, "ws must not be null"), this.ws.close());
    }, bi / 10), s && this.connect();
  }
  /**
   * @type {boolean}
   */
  get synced() {
    return this._synced;
  }
  set synced(e) {
    this._synced !== e && (this._synced = e, this.emit("synced", [e]), this.emit("sync", [e]));
  }
  destroy() {
    this._resyncInterval !== 0 && clearInterval(this._resyncInterval), clearInterval(this._checkInterval), this.disconnect(), typeof window < "u" ? window.removeEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.off == "function" && process.off("exit", this._unloadHandler), this.awareness.off("update", this._awarenessUpdateHandler), this.doc.off("update", this._updateHandler), super.destroy();
  }
  connectBc() {
    if (this.disableBc)
      return;
    this.bcconnected || (ia(this.bcChannel, this._bcSubscriber), this.bcconnected = !0);
    const e = q();
    b(e, Vt), Us(e, this.doc), ie(this.bcChannel, R(e), this);
    const t = q();
    b(t, Vt), gc(t, this.doc), ie(this.bcChannel, R(t), this);
    const n = q();
    b(n, mc), ie(
      this.bcChannel,
      R(n),
      this
    );
    const s = q();
    b(s, he), B(
      s,
      Me(this.awareness, [
        this.doc.clientID
      ])
    ), ie(
      this.bcChannel,
      R(s),
      this
    );
  }
  disconnectBc() {
    const e = q();
    b(e, he), B(
      e,
      Me(
        this.awareness,
        [this.doc.clientID],
        /* @__PURE__ */ new Map()
      )
    ), vs(this, R(e)), this.bcconnected && (oa(this.bcChannel, this._bcSubscriber), this.bcconnected = !1);
  }
  disconnect() {
    this.shouldConnect = !1, this.disconnectBc(), this.ws !== null && this.ws.close();
  }
  connect() {
    this.shouldConnect = !0, !this.wsconnected && this.ws === null && (bc(this), this.connectBc());
  }
};
function Pu() {
  if (crypto && crypto.randomUUID)
    return crypto.randomUUID();
  let e = (/* @__PURE__ */ new Date()).getTime(), t = typeof performance < "u" && performance.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
    let s = Math.random() * 16;
    return e > 0 ? (s = (e + s) % 16 | 0, e = Math.floor(e / 16)) : (s = (t + s) % 16 | 0, t = Math.floor(t / 16)), (n === "x" ? s : s & 3 | 8).toString(16);
  });
}
function xi(e, t, n) {
  if (typeof e !== n)
    throw new Error(
      `Invalid "${t}" parameter provided to YPartyKitProvider. Expected: ${n}, received: ${e}`
    );
}
var Ps = class extends Uu {
  id;
  #t;
  constructor(e, t, n, s = {}) {
    xi(e, "host", "string"), xi(t, "room", "string"), e = e.replace(/^(http|https|ws|wss):\/\//, ""), e.endsWith("/") && e.slice(0, -1);
    const r = `${s.protocol || (e.startsWith("localhost:") || e.startsWith("127.0.0.1:") || e.startsWith("192.168.") || e.startsWith("10.") || e.startsWith("172.") && e.split(".")[1] >= "16" && e.split(".")[1] <= "31" ? "ws" : "wss")}://${e}${s.prefix || `/parties/${s.party || "main"}`}`, i = s.connectionId ?? Pu(), { params: o, connect: c = !0, ...l } = s, a = {
      ...l,
      isPrefixedUrl: !!s.prefix,
      connect: !1
    };
    super(r, t, n ?? new mt(), a), this.id = i, this.#t = o, c && this.connect();
  }
  connect() {
    Promise.resolve(
      typeof this.#t == "function" ? this.#t() : this.#t
    ).then((e) => {
      const t = new URLSearchParams([["_pk", this.id]]);
      if (e)
        for (const [s, r] of Object.entries(e))
          r != null && t.append(s, r);
      const n = new URL(this.url);
      n.search = t.toString(), this.url = n.toString(), super.connect();
    }).catch((e) => {
      throw console.error("Failed to open connecton to PartyKit", e), new Error(e);
    });
  }
};
const Bu = ["data-playhtml-hover", "data-playhtml-focus"], ju = {
  defaultData: (e) => ue(e),
  myDefaultAwareness: { hover: !1, focus: !1 },
  onMount: ({ getElement: e, setData: t, setMyAwareness: n }) => {
    const s = e(), r = t, i = zu(s, (l) => {
      const a = l.filter(
        (h) => h.type !== "attributes" || !Bu.includes(h.attributeName || "")
      );
      a.length !== 0 && r((h) => {
        Fu(h, a);
      });
    });
    s.__playhtml_observer = i, s.addEventListener("mouseenter", () => {
      n({ hover: !0, focus: s.hasAttribute("data-playhtml-focus") }), s.setAttribute("data-playhtml-hover", "");
    }), s.addEventListener("mouseleave", () => {
      n({ hover: !1, focus: s.hasAttribute("data-playhtml-focus") }), s.removeAttribute("data-playhtml-hover");
    }), s.addEventListener("focusin", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !0 }), s.setAttribute("data-playhtml-focus", "");
    }), s.addEventListener("focusout", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !1 }), s.removeAttribute("data-playhtml-focus");
    });
    const o = (l, a) => {
      if (l.formState && (a.formState = l.formState), l.children && a.children)
        for (let h = 0; h < l.children.length; h++) {
          const u = l.children[h];
          u.nodeType === "HTMLElement" && a.children[h] && o(
            u,
            a.children[h]
          );
        }
    }, c = () => {
      r((l) => {
        const a = ue(s);
        o(a, l), a.children && l.children.splice(0, l.children.length, ...a.children);
      });
    };
    s.addEventListener("input", c), s.addEventListener("change", c);
  },
  updateElement: ({ element: e, data: t }) => {
    const n = ue(e);
    if (On(n, t))
      return;
    const s = e.__playhtml_observer;
    s && (s.takeRecords(), s.disconnect()), Bs(e, t), s && s.observe(e, {
      childList: !0,
      attributes: !0,
      subtree: !1,
      characterData: !0
    });
  },
  updateElementAwareness: ({ element: e, awareness: t }) => {
    const n = t.some((r) => r?.hover), s = t.some((r) => r?.focus);
    n ? e.setAttribute("data-playhtml-hover", "") : e.removeAttribute("data-playhtml-hover"), s ? e.setAttribute("data-playhtml-focus", "") : e.removeAttribute("data-playhtml-focus");
  }
};
function Ci(e) {
  return e.nodeType === "HTMLElement";
}
function On(e, t) {
  if (e.nodeType !== t.nodeType)
    return !1;
  if (e.nodeType === "Text" && t.nodeType === "Text")
    return e.textContent === t.textContent;
  if (Ci(e) && Ci(t)) {
    if (e.tagName !== t.tagName || Object.keys(e.attributes).length !== Object.keys(t.attributes).length)
      return !1;
    for (const [r, i] of Object.entries(e.attributes))
      if (t.attributes[r] !== i)
        return !1;
    const n = e.formState, s = t.formState;
    if ((n || s) && (!n || !s || n.checked !== s.checked || n.value !== s.value || n.selectedIndex !== s.selectedIndex) || e.children.length !== t.children.length)
      return !1;
    for (let r = 0; r < e.children.length; r++)
      if (!On(e.children[r], t.children[r]))
        return !1;
  }
  return !0;
}
function zu(e, t, n) {
  const s = { childList: !0, attributes: !0, subtree: !1, characterData: !0, ...n }, r = (o) => {
    const c = o.filter((l) => {
      if (l.target !== e)
        return !1;
      if (s.childList && l.type === "childList")
        return !0;
      if (s.attributes && l.type === "attributes")
        if (s.attributeFilter) {
          if (s.attributeFilter.includes(l.attributeName || ""))
            return !0;
        } else
          return !0;
      return !!(s.characterData && l.type === "characterData" || s.subtree && l.type === "childList");
    });
    t(c);
  }, i = new MutationObserver(r);
  return i.observe(e, s), i;
}
function Fu(e, t) {
  t.forEach((n) => {
    switch (n.type) {
      case "attributes":
        Hu(e, n);
        break;
      case "childList":
        Vu(e, n);
        break;
      case "characterData":
        $u(e, n);
        break;
    }
  });
}
function Hu(e, t) {
  if (e.nodeType !== "Text" && t.target instanceof HTMLElement) {
    const n = t.attributeName, s = t.target.getAttribute(n);
    s !== null ? e.attributes[n] = s : n in e.attributes && delete e.attributes[n];
  }
}
function Vu(e, t) {
  e.nodeType !== "Text" && (t.removedNodes.length && t.removedNodes.forEach((n) => {
    if (!Rn(n))
      return;
    const s = ue(n), r = e.children.findIndex(
      (i) => On(i, s)
    );
    r !== -1 && e.children.splice(r, 1);
  }), t.addedNodes.length && t.addedNodes.forEach((n) => {
    if (!Rn(n))
      return;
    const s = ue(n);
    e.children.find((r) => On(r, s)) || e.children.push(s);
  }));
}
function $u(e, t) {
  const n = t.target;
  switch (e.nodeType) {
    case "Text":
      if (n instanceof Text)
        return e.textContent = n.textContent || "", !0;
      break;
  }
  return !1;
}
function Rn(e) {
  return e instanceof HTMLElement || e instanceof Text;
}
function Yu(e) {
  if (e instanceof HTMLInputElement) {
    const t = {};
    return e.type === "checkbox" || e.type === "radio" ? t.checked = e.checked : t.value = e.value, t;
  }
  if (e instanceof HTMLTextAreaElement)
    return { value: e.value };
  if (e instanceof HTMLSelectElement)
    return { selectedIndex: e.selectedIndex, value: e.value };
}
function ue(e) {
  if (e instanceof Text)
    return {
      nodeType: "Text",
      textContent: e.textContent || ""
    };
  const t = {
    nodeType: "HTMLElement",
    tagName: e.tagName.toLowerCase(),
    attributes: {},
    children: []
  };
  for (const s of e.attributes)
    t.attributes[s.name] = s.value;
  const n = Yu(e);
  return n && (t.formState = n), e.childNodes.forEach((s) => {
    Rn(s) && t.children.push(ue(s));
  }), t;
}
function Ku(e, t) {
  t && (e instanceof HTMLInputElement ? (e.type === "checkbox" || e.type === "radio") && t.checked !== void 0 ? e.checked = t.checked : t.value !== void 0 && (e.value = t.value) : e instanceof HTMLTextAreaElement && t.value !== void 0 ? e.value = t.value : e instanceof HTMLSelectElement && t.selectedIndex !== void 0 && (e.selectedIndex = t.selectedIndex));
}
function Bs(e, t) {
  Gu(e, t), t.nodeType === "HTMLElement" && (Wu(e, t), Ku(e, t.formState), t.children.length > 0 && Xu(e, t));
}
function Gu(e, t) {
  t && t.nodeType === "Text" && e.textContent !== t.textContent && (e.textContent = t.textContent || "");
}
function Wu(e, t) {
  if (!t)
    return;
  const n = t.attributes && typeof t.attributes == "object" ? t.attributes : {};
  for (const [s, r] of Object.entries(n))
    e.getAttribute(s) !== r && e.setAttribute(s, r);
  Array.from(e.attributes).forEach((s) => {
    s.name in n || e.removeAttribute(s.name);
  });
}
function Xu(e, t) {
  const n = Array.from(e.childNodes).filter(Rn), s = Math.min(n.length, t.children.length);
  for (let r = 0; r < s; r++)
    Bs(
      n[r],
      t.children[r]
    );
  for (let r = s; r < t.children.length; r++) {
    const i = t.children[r], o = i.nodeType === "Text" ? document.createTextNode(i.textContent) : document.createElement(i.tagName);
    e.appendChild(o), Bs(o, i);
  }
  for (let r = n.length - 1; r >= s; r--)
    e.removeChild(n[r]);
}
function As(e) {
  return e !== null && typeof e == "object" && Object.getPrototypeOf(e) === Object.prototype;
}
function Nn(e, t) {
  if (t != null) {
    if (Array.isArray(t)) {
      e.splice(0, e.length, ...t);
      return;
    }
    if (As(t)) {
      for (const n of Object.keys(e))
        n in t || delete e[n];
      for (const [n, s] of Object.entries(t))
        Array.isArray(s) ? (Array.isArray(e[n]) || (e[n] = []), Nn(e[n], s)) : As(s) ? (As(e[n]) || (e[n] = {}), Nn(e[n], s)) : e[n] = s;
      return;
    }
    e = t;
  }
}
function Fe(e) {
  try {
    if (typeof structuredClone == "function")
      return structuredClone(e);
  } catch {
  }
  return e == null ? e : typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function xc(e) {
  const [t, n] = e.split("#");
  if (!t || !n)
    throw new Error("Invalid data-source attribute value");
  const s = t.indexOf("/"), r = s === -1 ? t : t.slice(0, s), i = s === -1 ? "/" : t.slice(s);
  return { domain: r, path: i, elementId: n };
}
const Ju = "LOCAL";
function Zu(e) {
  return e ? e.replace(/^www\./i, "") : Ju;
}
function vi(e) {
  if (!e) return "/";
  const t = e.replace(/\.[^/.]+$/, "");
  return t.startsWith("/") ? t : `/${t}`;
}
const qu = 150;
function Qu() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}
function td() {
  const e = crypto.getRandomValues(new Uint8Array(16)).reduce((s, r) => s + r.toString(16).padStart(2, "0"), ""), t = Math.floor(Math.random() * 360), n = [
    `hsl(${t}, 70%, 60%)`,
    `hsl(${(t + 120) % 360}, 70%, 60%)`,
    `hsl(${(t + 240) % 360}, 70%, 60%)`
  ];
  return {
    publicKey: e,
    playerStyle: {
      colorPalette: n
    },
    discoveredSites: [],
    createdAt: Date.now()
  };
}
function Cc(e) {
  const t = e.playerStyle?.colorPalette?.[0];
  return typeof t == "string" && t.length > 0;
}
function ed(e) {
  if (!Cc(e)) {
    e.playerStyle || (e.playerStyle = { colorPalette: [] }), Array.isArray(e.playerStyle.colorPalette) || (e.playerStyle.colorPalette = []), e.playerStyle.colorPalette[0] = Qu();
    try {
      localStorage.setItem(
        Un,
        JSON.stringify(e)
      );
    } catch (t) {
      console.warn("Failed to save player identity to localStorage:", t);
    }
  }
}
const Un = "playhtml_player_identity";
function Pn() {
  const e = localStorage.getItem(Un);
  if (e)
    try {
      const n = JSON.parse(e);
      if (n.publicKey)
        return Cc(n) || ed(n), n;
    } catch {
      console.warn(
        "Failed to parse stored player identity, generating new one"
      );
    }
  const t = td();
  try {
    localStorage.setItem(Un, JSON.stringify(t));
  } catch (n) {
    console.warn("Failed to save player identity to localStorage:", n);
  }
  return t;
}
function Ai(e) {
  return Math.round(e * 10) / 10;
}
const nd = "can-duplicate-to";
var Dr = /* @__PURE__ */ ((e) => (e.CanPlay = "can-play", e.CanMove = "can-move", e.CanSpin = "can-spin", e.CanGrow = "can-grow", e.CanToggle = "can-toggle", e.CanDuplicate = "can-duplicate", e.CanHover = "can-hover", e.CanMirror = "can-mirror", e))(Dr || {});
function _r(e) {
  return e.getAttribute("data-source") ? sd(e) : e.id;
}
function sd(e) {
  const t = e.getAttribute("data-source");
  if (!t)
    throw new Error("Element has no data-source attribute");
  const [n, s] = t.split("#");
  if (!n || !s)
    throw new Error("Invalid data-source attribute");
  return s;
}
const vc = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='44' height='53' viewport='0 0 100 100' style='fill:black;font-size:26px;'><text y='40%'>🚿</text></svg>")
      16 0,
    auto`, rd = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>✂️</text></svg>") 16 0,auto`;
function Si(e, { getData: t, getElement: n, getLocalData: s, setLocalData: r }) {
  const i = t(), o = s(), c = n();
  if (o.isHovering = !0, e.altKey) {
    if (i.scale <= 0.5) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = rd;
  } else {
    if (i.scale >= i.maxScale) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = vc;
  }
  r(o);
}
function dn(e) {
  if ("touches" in e) {
    const { clientX: t, clientY: n } = e.touches[0];
    return { clientX: t, clientY: n };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}
const id = {
  "can-move": {
    defaultData: { x: 0, y: 0 },
    defaultLocalData: { startMouseX: 0, startMouseY: 0 },
    updateElement: ({ element: e, data: t }) => {
      e.style.transform = `translate(${t.x}px, ${t.y}px)`;
    },
    onDragStart: (e, { setLocalData: t }) => {
      const { clientX: n, clientY: s } = dn(e);
      t({
        startMouseX: n,
        startMouseY: s
      });
    },
    onDrag: (e, { data: t, localData: n, setData: s, setLocalData: r, element: i }) => {
      const { clientX: o, clientY: c } = dn(e), { top: l, left: a, bottom: h, right: u } = i.getBoundingClientRect(), d = window.visualViewport?.width ?? window.innerWidth, f = window.visualViewport?.height ?? window.innerHeight;
      if (u > d && o > n.startMouseX || h > f && c > n.startMouseY || a < 0 && o < n.startMouseX || l < 0 && c < n.startMouseY)
        return;
      const p = t.x + o - n.startMouseX, g = t.y + c - n.startMouseY;
      s({
        x: Ai(p),
        y: Ai(g)
      }), r({ startMouseX: o, startMouseY: c });
    },
    resetShortcut: "shiftKey"
  },
  "can-spin": {
    defaultData: { rotation: 0 },
    defaultLocalData: { startMouseX: 0 },
    updateElement: ({ element: e, data: t }) => {
      e.style.transform = `rotate(${t.rotation}deg)`;
    },
    onDragStart: (e, { setLocalData: t }) => {
      const { clientX: n } = dn(e);
      t({
        startMouseX: n
      });
    },
    onDrag: (e, { data: t, localData: n, setData: s, setLocalData: r }) => {
      const { clientX: i } = dn(e);
      let o = Math.abs(i - n.startMouseX) * 2, c = t.rotation;
      i > n.startMouseX ? c += o : i < n.startMouseX && (c -= o), s({ rotation: c }), r({ startMouseX: i });
    },
    resetShortcut: "shiftKey"
  },
  "can-toggle": {
    defaultData: { on: !1 },
    updateElement: ({ element: e, data: t }) => {
      const n = typeof t == "object" ? t.on : t;
      e.classList.toggle("clicked", n);
    },
    onClick: (e, { data: t, setData: n }) => {
      const s = typeof t == "object" ? t.on : t;
      n({ on: !s });
    },
    resetShortcut: "shiftKey"
  },
  "can-grow": {
    defaultData: { scale: 1 },
    defaultLocalData: { maxScale: 2, isHovering: !1 },
    updateElement: ({ element: e, data: t }) => {
      e.style.transform = `scale(${t.scale})`;
    },
    onClick: (e, { data: t, element: n, setData: s, localData: r }) => {
      let { scale: i } = t;
      if (e.altKey) {
        if (t.scale <= 0.5)
          return;
        i -= 0.1;
      } else {
        if (n.style.cursor = vc, t.scale >= r.maxScale)
          return;
        i += 0.1;
      }
      s({ ...t, scale: i });
    },
    onMount: (e) => {
      e.getElement().addEventListener("mouseenter", (t) => {
        Si(t, e);
        const n = (s) => Si(s, e);
        document.addEventListener("keydown", n), document.addEventListener("keyup", n), e.getElement().addEventListener("mouseleave", (s) => {
          document.removeEventListener("keydown", n), document.removeEventListener("keyup", n);
        });
      });
    },
    resetShortcut: "shiftKey"
  },
  // TODO: add ability to add max # of duplicates
  // TODO: add lifespan to automatically prune
  // TODO: add limit per person / per timeframe.
  "can-duplicate": {
    defaultData: [],
    defaultLocalData: [],
    updateElement: ({ data: e, localData: t, setLocalData: n, element: s }) => {
      const r = s.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      ), i = document.getElementById(r);
      let o = document.getElementById(t.slice(-1)?.[0]) ?? null;
      if (!i) {
        console.error(
          `Element with id ${r} not found. Cannot duplicate.`
        );
        return;
      }
      const c = s.getAttribute(nd);
      function l(h) {
        if (c) {
          const u = document.getElementById(c) || document.querySelector(c);
          if (u) {
            u.appendChild(h);
            return;
          }
        }
        i.parentNode.insertBefore(
          h,
          (o || i).nextSibling
        );
      }
      const a = new Set(t);
      for (const h of e) {
        if (a.has(h)) continue;
        const u = i.cloneNode(!0);
        Object.assign(u, { ...i }), u.id = h, l(u), t.push(h), window.playhtml.setupPlayElement(u), o = u;
      }
      n(t);
    },
    onClick: (e, { data: t, element: n, setData: s }) => {
      const r = n.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      ) + "-" + Math.random().toString(36).substr(2, 9);
      s((i) => {
        i.push(r);
      });
    },
    isValidElementForTag: (e) => {
      const t = e.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      );
      return t ? (document.getElementById(t) || console.warn(
        `can-duplicate element (${e.id}) duplicate element ("${t}") not found.`
      ), !0) : !1;
    }
  },
  // TODO: auto-duplicate :hover CSS rules to [data-playhtml-hover] via CSSOM
  // so users don't need to manually rewrite their hover styles.
  "can-hover": {
    defaultData: {},
    myDefaultAwareness: { hover: !1 },
    onMount: ({ getElement: e, setMyAwareness: t }) => {
      const n = e();
      n.addEventListener("mouseenter", () => {
        t({ hover: !0 }), n.setAttribute("data-playhtml-hover", "");
      }), n.addEventListener("mouseleave", () => {
        t({ hover: !1 }), n.removeAttribute("data-playhtml-hover");
      });
    },
    updateElement: () => {
    },
    updateElementAwareness: ({ element: e, awareness: t }) => {
      t.some((n) => n?.hover) ? e.setAttribute("data-playhtml-hover", "") : e.removeAttribute("data-playhtml-hover");
    }
  },
  "can-mirror": ju
}, Ei = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAEARoABQAAAAEAAAA+ARsABQAAAAEAAABGASgAAwAAAAEAAgAAh2kABAAAAAEAAABOAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADouFg7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAYFUlEQVRoBZ1aaZBdR3U+3X2Xd986b1bNSBptIysaSUhIXsrYYBmDbZCBIhXbbCH5kWIzlSrHhCRVFJKohMqPQDCEqsSBEEKFChYkpOIFgwwabMmLPJLtkcbSWJqRNNKMZp95y73vLt2dr++bsU0oXIQ3uu/u3d85/Z3vnO4nRr/jR2tiRJoOHjzIaD9RP51md9PdNDh4mA+izbLXg/vNz8b+bj1Ig3QN9ei91K8P0SEapm16P+3X5glmmmJo7Hf4vNbJb/Wu1sz0cpAOMgMYINhdgxNsuuRyr6+NzdASW5iss8nuybS5bnybo5V9P/WlIDsulPRQMqfdpVBds6dHz8CoYRpeNgjm/D+M+a0MWPE2sDB4jy0MLvDynklGl4vCW1Nhg3SEH6HTdAPtFHeeu7dQmvSKMiy4LNIOWTbFnoopFwdRabL2i01/v0R0LsnRHzKa6qJ1sVRX1yTKHQxVec+CuhsjQ3QAG4aYpf5KnfGbvt7UgCZw8+oBAO9nHdTBhs4NiQ25eXGpe5obKvxp7b7s1p9c21eY7bjBStzdWolezUSXErygOHnKEiQt3ZCClpSlZxKhxsJsdCosXj16dcsz517uOuT3z9xCXken2kj9STB4WI++wZAU4JuMyG80QIMuTasPsiNEvBPb6CRZyr4kHm1/if/RsU+0bzq+fV+mkb1TaeutmrOCEsySnOGUSRyrWMCPFiNpXGlxkpyEsrhQgmLcryW2PJl41f+a33DqFy9t+uupDXSb9iY71Vh9Tu643Cb37iVFiJM3G4k3MeAAPHwadCnztXu288nZy85I+xi/fnZz9h3fv3NfdqHwCUaiH4CFtACIM60MWLNxYgCJY44BWT5//ZgkrsEQ0oLDYEqkpU4nxcWHRlcfeqK47lStOLNbUwclIzQhJ6lHmmD/TUb8mgErnj9E93CMgFhzeY0YzZbsx1oPiy//x+e2dp7u/nMrcd4NYBwg0TnXALQMGPvUAABMDQD4piEAy3QCw7QNozjXCZ5DG1rjvmLcwrGM7egJv/PMV872f+mVvvnrqaV1Q3x5uCKpv1+aID9gYuP/0Amvv/4xnIcqsgEaEB3rOwWG05pfrZ2z3qjzhQc/fVfXue6v2IlzLcFr2BRxgGCa4xjf2Bs34ducg//pFTLeFuk5gxFmS89BUGM0njNtEIwyOOx+K+i8pW3hlsmljU+MiQWHs14bnc3QZ+g0XrmHjhw4YmTwtU/6Wnq2rOv79/ez/k7iHpE1203OSRp17n/wIx9pn2r5GjD3EiURIT6gD9g0RwNmD9cb32BPRmoBa3lsISfmKH1cGQNTI82I4RhPvW4IRoLrkDGxzq2t/kb74Bc/Vi2/YCWLi85GYDk0vE0Y6U51GH2sWGCtHGB4oDT3sI1U5l65By+SM9ty3vn8Nz/0kcKct5+4dAE1MR1yIJFNrEAGSwwq05ARP4PYtI9rqU9Sk3APlxhoLzkMXDYTBqSmpvFjxk/gZtoHy9hR+4Hyi19jk7u+/O/jiy3k9RMFw9vo0Om0DyBoIk9HwPC+/xACFuAnJ3vsxCPn+ZbT9se/e/udxXn3APEko0WsNI9BDzCZQ1eUhiHoT6JjpcEXyJTBiZFotm1gNoGnV3ACSTEeZKCd8b6hTkq5lHxmNCgloqEkGmeuHXd+sXv483dVWp4SCZHjlclauLvMDx06xFdiNY0BdoDx/m2dvI0KlozJnixP2B/86Q39q8+VvyoUtcF7Ev2bztFts6OU6Ib+6FiASBKwEIxNYLhmuG0CNAWKgDXcT9VHpHJqAng5HmC2BVtxjtfTZk0vqdGcu0IWdjn+xufnW385QzMZ1ltuVbltM/q7NEBHDh6BxfD+fiSpoXNzYnTWs2tO6LZP54q9Z0sPQCs2KBFJEjE6SyCY2PPICCfokMDZCXu1Mc2eTa5YdfBKYCQESGTBtY6JYUMl/DOflFXGKOBNA9moFYIYRsIny39GAGAHM8Zgw0iAqWJ9trb9gfzSxhJlfacy69szcGQaD8AujPcLZAkrhCB6ifti4YJz74/f8v7Con0fhjRZadowt3ls+jB0ZvzFeJqP1CZYezZD7uZ2np8lVbEkGxVVflFXRJRlLMccaL5RHqBJRwFSYDfPzTWjUhhGYxhGABamo2BGA/dMj3icMXtTJlp7IVn3xHCYZMmbz6jewk79z/SIFnv3kuhe324tJYGT2NrdfaajZ/PZ4kHwuwtOhFTCnaat1JNGR4xXDVtRqKFY2Co2ad9eRayTWOusVCfYrFWItepkWcVWCeRmS4NPOrGBxBiyvMkV8GYEABr0QZtofIVKqWE4x3UYIzjLro11+CR3p/3JRST48hVZojHN79p7DavBB5bFrfFcRWw9U7zV0kk/WXFKHdCGmIjwRMSYlaCTEJ3EpO2YZplknzp3wb7//CvOI5VEHHaLogopOkFdYkB3WFP1PEQJ4QccMBkxYjzfjAUTH3AMAMITuGZyBIIJfTXP8Y4xxtwDbbVEh9tytbe/N6RXWUcHt8SUaxnRsYYuRKKrSFYgE3tTVCiWKvIDUBsHrYcQPagklFYbzyutlZEYCzKimQ92XV3y2WI1oMSRND7F2WnvBjtayKNqmwVoi8pyNf1xjxX1utIAR1kBJQIosxlvN8ECsKEPrjGO9G6hP1OWyATAcQPsgnjgg6dl6x2u2v2jsBEuzdj5eC2FnEfuepQECPaOHN/2SmazUHIXPByTMB6H54XxOHJXum/gOEBnIYVezJbqDYhbhrlegZS/REvT50i3byHbQcpIGjR67gwNLOWETDnepI+JA0q9DGTL6kOoixjYlqDqfun4z8Wrw4OC2XAUjIQRK7ERc3J2Zus391G+KhyLrPHJUPBrukGORmhfpMDqmKYbOY9z0Hx0YhQnBtiIeGoMDLFCSB42EfB5HvCh6bNsce4iLc1NICHZNDc+Rg7q/5nZNpqfEzRzOaTnzi+IMcqiDjXFHTyfFnHwfgo6pQucwpnlOnRu5GX++A+/LV56/gjKPHDHPGPiIt2Mell5O15/Qy2Y5LhlWXaLsBYXIUEF3yqDZF4cbcdlDCDSkxk0UweDpNXIxJ6gjLBgFJDAW4tRTJ/b3iPFNRYtKIuGihl+yp9HVbZEhbY1tHglogC2XrykaGiXa3WWw0gikOFtiAoi0/DdqA6QmDgIk5CdPHZYWLZLO2+6TflBnTmeB+fhPgLI0IgjmBWVdpVzLQ6Xvmy1ssjd9VAkLMv7LjttlpTriBkPp7RBR6H13Py8/svnzoh/PDPGcQ5qN0g7ocYfK2SIetttvaM7q3e1OnpdXuilqcvUucoi7hYpX3SpuhjSi+MxX7TcJnDUZwQDmA0umQ0GCddmZ15+jk9cfJVt3nmdTlBufe+rX7Ce/M9/FXESNZ/DK7ADg+GsFbUdrX4jEVrMCCtTKvAai3i2KouCRe3IiqYsM0ppHZ8M1TdOzoggUXRXX0mTHQioslIiQyNXKuyx8Ssin3GolC9Saf0WymWXaPLqFLX21sjN5iib47S4ENL5sRq7cG2b1d/akKCaycAYyXRwIX+C6n6FBp/6qXDcDO259U7l5fIoJTidGPgpjxGOt3/0T5TtZKAhCqpid3LqKDl8bDrDiijMg0g0KBFujLTDI+hRiPQWiuNTNfX1E9M8lJo++daSfk+fw7UINLMDVtc1um6V0F+6qazue0tB7esVyuUx3drV0Lzhk6xdpVzJIzeXJxsxMzNZo7MzyN9OhoOHqHIQvR6CNCNIZB0aPnGUT10ao2v23KjXbOmn9rXr2fs/+WeyY3WvPv3sAP/Z97/Fo7ixoloFrnOejdDWQSJ40vDTVAXXOozHGSgOPzMf6K+/sMhjVF+fvDarbt8M7ouGwgiAw3W+hBphPIjYOOq1uquZVwQjXJv2rFmg9YVAT1++TB3tKCpEjnI5onoloOHhClviHud5pGEPxHdgBKizVJnnLz59mHv5Au2+7U6MMubQyB2rNmxi7/v0A7pjzTp96pkBfuzRHwrQTSMxZqAErp+JuMjZEGsvSxgBjgk3LIT6IIJ9mWg/1lR0GfWWET5OYAIaqciEkqSqamEjExM0Nh1zxm2tnTyVOmtsTdclvXt1nn1vuECr+uYpWypSsOCQng5pdGSRzk918Y4eV2u0jZaYgOa//OhhNjdxhXa/6z26a+MmpB7kHASuqZdaOjsp31ImMzpxiPgz8YzbRgesCuMV9A4dsJgXgfg2SnwrCiGqetcaRffuZHqxoenvnm7wM3OhJjfgZPuo0hq05NfZJ24O6L531OgzN8/Qx3dfobUlTCBK8/zdO16lDNVpZmyE2jpyoFGRMpmI5q7W6NixJVYx88+cYCJrs5mr4+zkz59gpY4OunbfB0BPKBwGh0NSg0adHnnoQT46dJJt2nUt3fj79yKCQXkIlqKGSoDbKCVsMl8Jq2HKqkTsmwTGrZDfszthH96t9HRN01cHFBueiTRzkMiciCaqMQ1cctmxKzkanM2zkVqJFUooaopF2rDRpuv66nR5dJxsPUeFjlVUKNkko4BOPnWFjr9QJ+YgGaIUOfGzx1htYZ627b2N2tat5qgXUqUK6lX2+D99nY8cf4Y27tpD+z5zvyq0tpn5BPKJrMXMjzwzm8imBoDX+FQ8UZdOMktomKwIdXGk77m2QR+9PtKTFUY/OAnVsHyK0I3gPnS7QpPVhEamOT1/waZq4hJlyzCiTO+7qQHKxTQ2+EvKZxrUuWk9uW5Cs1cW6AcPjbKBX4R6cXFGXx4+Qa09q2nXHbeDGWAVwoJDZi+cfonOPnuUNu25jvZ99n7tlUqoLVFXYoQUk/OaL9ZDFOzkg4c/qv9Nt/SDYj3Lin9w/NTf5mX0TpKQHsN3M0nBi2PIqp6rqadN0Vw9T7NBibasN/UOQDs2XZxspwvBFrpl6yjOSyTdFnrgH1ro8LOoSCxNnX07idw19OrJK1SZrlCx1aXr37Wa3v72ht642dItnWtQZxgyIH8gUQY1n82Nj1M7VCiTzzEtm+WQBekJw9nDV4K/+Kus2151hVWxMvVYBy4padtJzbOG8/XqO0mY2t8YYBIHo02ICYQcNosW4zw9ctKho+e7zCwCABlVEB7bt+EZB5JjeSRyGfrUhyx6/lRC1XpC4y89RS1dq2kPqHJiYJQWJmbpyYfnafLSRvaxz/ZSucvH1MRGusUkCRVfJufo3u1bAcoELaZcSNqGJZgvgezzI5imyBilZQjs4mNfvNFLlLJlRJkssuuq6sIdqAyNK0AwUxmazQZ4bDa8vdBOXYUKbepR1AWFai8RLdY59axuo55V6MH2oCBZ6lidwwJXoo8+U0eRaZNfmaYc6LRu21a6+MorwFCjq2OXKYzyrG9HgQpFFL943ThNowpWCmU4Rt/UESl8U9VoFTX00W9pmp6AtxqYpoeWgzWQQAuZs6UcK3de3DI9dSbL5M50SE0tiw0IYERzm0U87NqUp2IBBmEENHdoJoAaI0dBPnANlaiAdALJLW/L6ClMEH7833Ns5opmY0Mv061bt8OI66gyP0UyrtHE+SkaPdtD3d3wqQliU/Ux8A4hawxBozACAgjHxPHicBAPXpQ2JktxKCnbkFZVulLKGIlAyqVsrjpfKD2V9asgLQwGaIRVEzzASnJp6NUFOnISIeTgHu4HUNj+vjKtXrca4JtGGWNRB5IfJrT3vXm564MZ+ctH5q2xUwFT1af5Te/4PS0yiBXZQvX5aeZPnsTkd4PJM8YImI6QhiFQexiC/lF3SBnoSJ4/nCTTVUu2oRDKJJWKray6gq8lVv1QR2e1r4Y6ugc6x6P3A18vWmyCN96HAUkiaN/NHq1ZVYCX4W2Uzob/tdBC6QD1MiOQUs7Mxom8IukIFWgRVe8dH1+FAiiXVC4mPNs6hXDJA1qG/EWbNeaxXMMwAiZLGc8b8IY62EwAcNRPUlXOV+XR55hdALlQ6wuFNao6llXjmswmdqJzPEQOi6fzhenJQumH6xr1+03FZTzRpI9FbsaiLZsQEyYeLMgYPJ5twd5GWSrMcyZeDAWMAUoXOywIiKII8yvjV8zqqLjew9zSBCx2AJtt9XSutUVLiUU5hqye0gh3TUAYITHzSrzYkK/8qB6cm/bsVsyyVCSryFuWK7kM8jLjoZRL4hjq2UAgxy92rTriW5kXCDOrlOeGGiaQzd6AN0AR569t6QTXgG8aAO1K/YgZaPppikjKacQhZIUS2JPABGyYhSkFTGbuTKaUMSOBOTfDdewxA+CxnH6u0njyaS9TxLK8CA3WJKsSg53vWD8hRZyTeVdGKhEh6NTwmaqcai3/m2QWEptjipbUkBTgyvHKfsXr8LwJeDyY+jDVD0MJONEYYCihEUXIcNhjvmuOAdpM+psTfxhjjjHXNsZh6o/ZpOKJqk/Vo2PfU8yvCGCDOoV5Nxs1yjLZsb5b8lF6l3KCugwSKy4K1UD0Ba7i4ZlS7sxoPvcvmlvIRk2v43jZy2/cr1CsGdRGftG7kW8AAc5UVyAFIGOT02ZhADex0GAKQ0z+8KAxIjUOzxu2IXMxiewbRY1k6NuBHBoRPBvGBlschUESxPLCrBylsuJ3Y919ZG5CliKZ+KGOMLcJIEr1bCTD4y35gYuu8x0AT0zAokgCqBXwrwNvUgreNyOALfV+6nucAma6GToDZgra6LtZ5Vg2wni8SSFDowTvS6Ehmo1o5Du16OhRUjkUaHYNU/jAbY8bDWDdsd5JfzNAj/u1+aVQVnsT36vFodANVKQBklDdUio42pb5n0sZC0ZgfRWJ7PVgNcaYgDWGoJnl4DVwUwNSsE3MZlFvJQ5S76f0WTbCjMLySKR7LLogFqI4Hv3Okn/kMcEdH+/UgDnIR7oxO58k7dUwQT5X5pcbVApMDyCsx5dOKcffEIc+FkdZyYdXa6jNa65iwdESe/Sswx6MGZ9FVdYEbLxtQK8AB1WM900qMkLYNAIGmMvYgdzYmRFYMc/sscaaFgiGUul1S+vGTCN59Zvz9WM/cWzPl1LUsAxbb7GVrxwndHwrxk+6cvjgNjRo/tK2TeMH2UM0IbypotPa1eYszi/kMIfMu7YuJHFSih07syEUW7Yn3oeLwt1jKAX0yDGgFjJvM4lhHRRy2kAhUEcQBth88BmTTF2H8phiAVMudIp3sWAG2cQeFRqqKmgxxLbxYtA4/3AQXjrLAZ4nooLArjaYrDl+1m+ARf1dm6M9NImAOWB8ZYA3P2gax4f44+euWqLvkrVUybsi8bP4EStvWzyPZY8ilswxg3VKO5T3trW8sM/lzrpUas1CqYkPGKK4AHDM6MBxAzxYNqABsYRB6BHZNV3RMg7AvBKVIybrl5Nk8fEgHD0mo2iJW3YdSxNVeKaGHyBqmOgEOT9unAV1VvVdTe6mhyFvRt9M/frax9iitdd3UAaEpZUQ1MPiXODlDMUVqk44F6oWK/WsqPzsvA6H+qi0Z1VCN2WF1weptU2MwBSUv9gMi5ramVa0aN3QFSRKRx6YVahVcFYrfzCKpp6Lw8oMt52G7WZqUsl64opaEks/C/DlghsGU7VkB6gzQG1pAyuwXxsBcwGdsoN0gN2CzgL8XjBb6LUy3oTrRnYm1DyL5bAsKtUsxTKfcO2Z6akjeanHLq7pEcXtBTu/3mJ2Z8x1CYuRmQbWQKDLUAUZ+pT4GI35ROpZmURjMvbPKl27HMVB1eIZhBcL0F4d65B1JKrAZRk/dDBdD6ejbR2d0SE6gqDdi0DZD+o0vW8w/4oB5oIJNo14OAIjhs61ig198yK5sOjwbNZNHJZxpPKU0B5STRbx54HCuCSdiKFQUsIpca/oMTuLFTWUpEZ/EdKMQVYakHFdlypGfYriHUJv2Zj2aRYiOTcsZvkxlAYTesh4FNp2rlENa3GmKx93HCG1d+9+kzgQN6+DN+dvoJA5Bf70e78eOHhQ9e9fpbvplBq1ctrtTFDbtiTKX4xZ7IRIqCYrZljCXYiPm8XUDGnfDmVcxQPNXxYkijR8UAxjrQlBACpaKB1Bt1jFEng5BlaG3FaNmtRh3lONnCyEkbLjWstSnBkuSerqlwMDw/rWW38VeAoTX78+Ait3sDeUOkQP8434zx1DbZMil5u2Kq7rrOUlqxb5jp11bJQrThwoF1Niy0owHlh0RZJCBYYS2PAdH+RoPIb5FNBicdMsKMTCQkWJVJsESYz/wBCxOBsFmQZ+667EHXU/GUGiKkPr3xiwb4D22uH/At4IJ6pN/ZoEAAAAAElFTkSuQmCC", ki = {
  inspect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>',
  minimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="12" x2="18" y2="12"/></svg>'
}, od = {
  "can-move": "#4a9a8a",
  "can-spin": "#5b8db8",
  "can-toggle": "#c4724e",
  "can-grow": "#d4b85c",
  "can-duplicate": "#8a6abf",
  "can-mirror": "#4a9a8a",
  "can-play": "#3d3833",
  "can-hover": "#5b8db8"
}, cd = "#8a8279", ld = `
#playhtml-dev-root {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  font-family: 'Atkinson Hyperlegible', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #3d3833;
  pointer-events: none;
}
#playhtml-dev-root * {
  box-sizing: border-box;
}
.ph-trigger {
  pointer-events: auto;
  position: fixed;
  bottom: 16px;
  right: 0;
  width: 120px;
  height: 48px;
  background: linear-gradient(135deg, #f0e9dd 0%, #e8e0d4 40%, #d8d0c4 100%);
  border: 3px solid;
  border-color: #f5f0e8 #7a7269 #6b6560 #ede6da;
  border-right: none;
  padding: 4px 6px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  z-index: 100000;
  box-shadow: -2px 0 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08), 0 -2px 6px rgba(0,0,0,0.1);
}
.ph-trigger:hover {
  background: linear-gradient(135deg, #f8f2e8 0%, #f0e9dd 40%, #e0d8cc 100%);
  box-shadow: -2px 0 6px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.12), 0 -3px 8px rgba(0,0,0,0.14);
}
.ph-trigger img {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px #5b8db8);
}
.ph-trigger-grip {
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
  flex: 1;
  justify-content: center;
}
.ph-trigger-grip span {
  display: block;
  width: 2px;
  height: 16px;
  background: linear-gradient(180deg, #f5f0e8 0%, #8a8279 50%, #6b6560 100%);
}
.ph-bar {
  pointer-events: auto;
  display: none;
  flex-direction: row;
  background: #e8e0d4;
  border-left: 3px solid #3d3833;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
}
.ph-bar.ph-open {
  display: flex;
}
.ph-bar-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.ph-bar-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ph-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: linear-gradient(180deg, #ede6da 0%, #d4cfc7 100%);
  border-bottom: 1px solid #8a8279;
  flex-shrink: 0;
}
.ph-toolbar .ph-logo-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}
.ph-toolbar .ph-logo-btn img {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 0 4px #5b8db8);
}
.ph-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: #e8e0d4;
  border: 2px solid;
  border-color: #f5f0e8 #8a8279 #8a8279 #f5f0e8;
  cursor: pointer;
  color: #3d3833;
  padding: 0;
}
.ph-btn:hover {
  background: #f5f0e8;
}
.ph-btn.ph-active {
  border-color: #8a8279 #f5f0e8 #f5f0e8 #8a8279;
  background: #d4cfc7;
}
.ph-btn svg {
  width: 16px;
  height: 16px;
}
.ph-data {
  flex: 1;
  padding: 6px 10px;
  overflow-y: auto;
  background: #f5f0e8;
  font-size: 12px;
}
.ph-data::-webkit-scrollbar {
  width: 4px;
}
.ph-data::-webkit-scrollbar-thumb {
  background: #d4cfc7;
}
.ph-reset-btn {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #c4724e;
  cursor: pointer;
  background: #e8e0d4;
  border: 2px solid;
  border-color: #f5f0e8 #8a8279 #8a8279 #f5f0e8;
  padding: 2px 8px;
}
.ph-reset-btn:hover {
  background: #f5f0e8;
}
.ph-reset-btn:active {
  border-color: #8a8279 #f5f0e8 #f5f0e8 #8a8279;
  background: #d4cfc7;
}
.ph-tree-item {
  padding: 3px 0 3px 14px;
  border-left: 1px solid #d4cfc7;
  font-family: 'Martian Mono', 'SF Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ph-tree-item:hover {
  background: #faf7f2;
}
.ph-tree-toggle {
  color: #8a8279;
  font-size: 10px;
  width: 10px;
  flex-shrink: 0;
  text-align: center;
  user-select: none;
}
.ph-tree-key {
  color: #4a9a8a;
}
.ph-tree-value {
  color: #c4724e;
}
.ph-tree-badge {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-size: 9px;
  padding: 1px 5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #faf7f2;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}
.ph-tree-el-name {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-size: 12px;
}
.ph-tree-reset {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-size: 10px;
  color: #c4724e;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
}
.ph-tree-item:hover > .ph-tree-reset {
  opacity: 1;
}
.ph-tree-children {
  display: none;
  margin-left: 14px;
  padding-left: 6px;
  border-left: 1px solid #d4cfc7;
}
.ph-tree-children.ph-expanded {
  display: block;
}
.ph-tree-child {
  padding: 2px 0 2px 28px;
  font-family: 'Martian Mono', 'SF Mono', monospace;
  font-size: 11px;
  border-left: 1px solid #d4cfc7;
  margin-left: 14px;
}
.ph-resize-handle {
  width: 6px;
  cursor: ew-resize;
  background: #d4cfc7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-right: 1px solid #8a8279;
}
.ph-resize-handle::after {
  content: '';
  width: 2px;
  height: 40px;
  background: #8a8279;
  opacity: 0.5;
}
.ph-status {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 10px;
  background: #d4cfc7;
  border-bottom: 1px solid #8a8279;
  font-family: 'Martian Mono', 'SF Mono', monospace;
  font-size: 11px;
  color: #6b6560;
  flex-shrink: 0;
}
.ph-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ph-status .ph-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ph-status .ph-dot.ph-connected {
  background: #4a9a8a;
}
.ph-status .ph-dot.ph-disconnected {
  background: #c4724e;
}
.ph-status .ph-sep {
  color: #b0a99e;
}
.ph-minimize-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 20px;
  background: #e8e0d4;
  border: 2px solid;
  border-color: #f5f0e8 #8a8279 #8a8279 #f5f0e8;
  cursor: pointer;
  color: #3d3833;
  padding: 0;
  margin-left: auto;
}
.ph-minimize-btn:hover {
  background: #f5f0e8;
}
.ph-minimize-btn:active {
  border-color: #8a8279 #f5f0e8 #f5f0e8 #8a8279;
  background: #d4cfc7;
}
.ph-minimize-btn svg {
  width: 12px;
  height: 12px;
}
.ph-status-field {
  position: relative;
  border: 1px solid #8a8279;
  padding: 2px 8px 2px 8px;
  margin: -2px 0;
  display: inline-flex;
  align-items: center;
}
.ph-status-field-label {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: #d4cfc7;
  padding: 0 4px;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: #4a9a8a;
  line-height: 1;
  white-space: nowrap;
}
.ph-json-string { color: #c4724e; }
.ph-json-number { color: #5b8db8; }
.ph-json-boolean { color: #d4b85c; }
.ph-json-null { color: #8a8279; font-style: italic; }
.ph-json-bracket { color: #8a8279; }
.ph-json-count { color: #8a8279; font-size: 10px; margin: 0 2px; }
.ph-json-row {
  padding: 2px 0 2px 4px;
  font-family: 'Martian Mono', 'SF Mono', monospace;
  font-size: 11px;
}
.ph-json-expandable {
  cursor: pointer;
  user-select: none;
}
.ph-json-expandable:hover {
  background: #faf7f2;
}
.ph-json-toggle {
  color: #8a8279;
  font-size: 8px;
  margin-right: 4px;
  display: inline-block;
  width: 10px;
}
.ph-json-nested {
  display: block;
  margin-left: 14px;
  padding-left: 6px;
  border-left: 1px solid #d4cfc7;
}
.ph-json-nested.ph-collapsed {
  display: none;
}
.ph-search-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  align-items: center;
}
.ph-search-input {
  width: 180px;
  padding: 3px 8px;
  font-family: 'Martian Mono', 'SF Mono', monospace;
  font-size: 11px;
  color: #3d3833;
  background: #faf7f2;
  border: 2px solid;
  border-color: #8a8279 #f5f0e8 #f5f0e8 #8a8279;
  outline: none;
}
.ph-search-input::placeholder {
  color: #b0a99e;
}
.ph-search-input:focus {
  border-color: #4a9a8a #d4cfc7 #d4cfc7 #4a9a8a;
}
.ph-tag-filter {
  padding: 3px 6px;
  font-family: 'Atkinson Hyperlegible', sans-serif;
  font-size: 11px;
  color: #3d3833;
  background: #e8e0d4;
  border: 2px solid;
  border-color: #f5f0e8 #8a8279 #8a8279 #f5f0e8;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8279'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 5px center;
}
.ph-tag-filter:hover {
  background-color: #f5f0e8;
}
.ph-empty {
  text-align: center;
  padding: 20px;
  color: #8a8279;
  font-size: 12px;
  font-family: 'Atkinson Hyperlegible', sans-serif;
}
.ph-inspect-highlight {
  outline: 2px dashed #4a9a8a;
  outline-offset: 2px;
  position: relative;
}
.ph-inspect-highlight-hover {
  outline-color: #c4724e;
  box-shadow: 0 0 0 4px rgba(196, 114, 78, 0.15);
}
.ph-inspect-selected {
  outline: 2px solid #c4724e;
  outline-offset: 2px;
}
.ph-inspect-label {
  position: absolute;
  top: -18px;
  left: 0;
  background: #4a9a8a;
  color: #faf7f2;
  font-family: 'Martian Mono', monospace;
  font-size: 10px;
  padding: 2px 8px;
  pointer-events: none;
  z-index: 99999;
  white-space: nowrap;
}
@keyframes ph-flash {
  0% { outline: 3px solid #d4b85c; outline-offset: 2px; }
  100% { outline: 3px solid transparent; outline-offset: 2px; }
}
.ph-flash {
  animation: ph-flash 0.8s ease-out;
}
`;
function Ac() {
  const e = [];
  document.querySelectorAll("[shared]").forEach((t) => {
    const n = t, s = n.id;
    if (!s) return;
    const r = `${window.location.host}${vi(
      window.location.pathname
    )}#${s}`;
    e.push({
      type: "source",
      elementId: s,
      dataSource: r,
      normalized: r,
      permissions: n.getAttribute("shared")?.includes("read-only") ? "read-only" : "read-write",
      element: n
    });
  }), document.querySelectorAll("[data-source]").forEach((t) => {
    const n = t, s = n.getAttribute("data-source") || "", [r, i] = s.split("#");
    if (!r || !i) return;
    const o = r.indexOf("/"), c = o === -1 ? r : r.slice(0, o), l = o === -1 ? "/" : r.slice(o), a = `${c}${vi(l)}#${i}`;
    e.push({
      type: "consumer",
      elementId: i,
      dataSource: s,
      normalized: a,
      element: n
    });
  });
  try {
    console.table(
      e.map((t) => ({
        type: t.type,
        elementId: t.elementId,
        dataSource: t.dataSource,
        normalized: t.normalized,
        permissions: t.permissions || ""
      }))
    );
  } catch {
  }
  return e;
}
function y(e, t, n) {
  const s = document.createElement(e);
  return t && (s.className = t), n && Object.entries(n).forEach(([r, i]) => s.setAttribute(r, i)), s;
}
function ad(e) {
  const t = document.getElementById("playhtml-dev-root");
  t && t.remove();
  const { elementHandlers: n } = e, s = document.createElement("style");
  s.textContent = ld, document.head.appendChild(s);
  let r = !1, i = null, o = null;
  const c = [], l = y("div");
  l.id = "playhtml-dev-root";
  const a = y("div", "ph-trigger"), h = y("img", void 0, {
    src: Ei,
    alt: "playhtml"
  });
  a.appendChild(h);
  const u = y("div", "ph-trigger-grip");
  for (let C = 0; C < 4; C++)
    u.appendChild(document.createElement("span"));
  a.appendChild(u);
  const d = y("div", "ph-bar"), f = y("div", "ph-resize-handle"), p = y("div", "ph-bar-content"), g = y("div", "ph-toolbar"), w = y("div", "ph-logo-btn"), x = y("img", void 0, {
    src: Ei,
    alt: "playhtml"
  });
  w.appendChild(x), g.appendChild(w);
  const E = y("button", "ph-btn");
  E.innerHTML = ki.inspect, E.title = "Inspect", E.style.width = "26px", E.style.height = "22px", g.appendChild(E);
  const I = y("div");
  I.style.flex = "1", g.appendChild(I);
  const G = y("button", "ph-minimize-btn");
  G.innerHTML = ki.minimize, G.title = "Minimize", g.appendChild(G), p.appendChild(g);
  const Nt = y("div", "ph-status"), rt = y("div", "ph-status-row"), nn = y("span", "ph-dot ph-connected");
  rt.appendChild(nn), rt.appendChild(document.createTextNode("connected"));
  const Nr = y("span", "ph-sep");
  Nr.textContent = "·", rt.appendChild(Nr);
  const Ur = document.createTextNode("");
  rt.appendChild(Ur);
  const Pr = y("span", "ph-sep");
  Pr.textContent = "·", rt.appendChild(Pr);
  const Br = document.createTextNode("");
  rt.appendChild(Br), Nt.appendChild(rt);
  const sn = y("div", "ph-status-row");
  let rs;
  try {
    rs = decodeURIComponent(e.roomId);
  } catch {
    rs = e.roomId;
  }
  const is = y("span", "ph-status-field"), jr = y("span", "ph-status-field-label");
  jr.textContent = "room", is.appendChild(jr), is.appendChild(document.createTextNode(rs)), sn.appendChild(is);
  const zr = y("span", "ph-sep");
  zr.textContent = "·", sn.appendChild(zr);
  const os = y("span", "ph-status-field"), Fr = y("span", "ph-status-field-label");
  Fr.textContent = "host", os.appendChild(Fr), os.appendChild(document.createTextNode(e.host)), sn.appendChild(os), Nt.appendChild(sn);
  function cs() {
    let C = 1;
    try {
      const D = e.cursorClient?.getProvider();
      D && (C = D.awareness.getStates().size);
    } catch {
    }
    Ur.textContent = `${C} client${C !== 1 ? "s" : ""}`;
    let m = 0;
    n.forEach((D) => {
      m += D.size;
    }), Br.textContent = `${m} element${m !== 1 ? "s" : ""}`;
  }
  cs(), p.appendChild(Nt);
  const Hr = y("div", "ph-bar-main"), ft = y("div", "ph-data");
  Hr.appendChild(ft), p.appendChild(Hr), d.appendChild(f), d.appendChild(p), l.appendChild(a), l.appendChild(d), document.body.appendChild(l);
  function rn(C, m, D, S) {
    if (m === null) {
      const k = y("div", "ph-json-row");
      if (S !== void 0) {
        const v = y("span", "ph-tree-key");
        v.textContent = S + ": ", k.appendChild(v);
      }
      const M = y("span", "ph-json-null");
      M.textContent = "null", k.appendChild(M), C.appendChild(k);
      return;
    }
    if (m === void 0) {
      const k = y("div", "ph-json-row");
      if (S !== void 0) {
        const v = y("span", "ph-tree-key");
        v.textContent = S + ": ", k.appendChild(v);
      }
      const M = y("span", "ph-json-null");
      M.textContent = "undefined", k.appendChild(M), C.appendChild(k);
      return;
    }
    if (typeof m == "string") {
      const k = y("div", "ph-json-row");
      if (S !== void 0) {
        const v = y("span", "ph-tree-key");
        v.textContent = S + ": ", k.appendChild(v);
      }
      const M = y("span", "ph-json-string");
      M.textContent = m.length > 80 ? `"${m.substring(0, 80)}..."` : `"${m}"`, m.length > 80 && (M.title = m), k.appendChild(M), C.appendChild(k);
      return;
    }
    if (typeof m == "number") {
      const k = y("div", "ph-json-row");
      if (S !== void 0) {
        const v = y("span", "ph-tree-key");
        v.textContent = S + ": ", k.appendChild(v);
      }
      const M = y("span", "ph-json-number");
      M.textContent = String(m), k.appendChild(M), C.appendChild(k);
      return;
    }
    if (typeof m == "boolean") {
      const k = y("div", "ph-json-row");
      if (S !== void 0) {
        const v = y("span", "ph-tree-key");
        v.textContent = S + ": ", k.appendChild(v);
      }
      const M = y("span", "ph-json-boolean");
      M.textContent = String(m), k.appendChild(M), C.appendChild(k);
      return;
    }
    if (Array.isArray(m)) {
      const k = y("div", "ph-json-row ph-json-expandable"), M = y("span", "ph-json-toggle"), v = y("div", "ph-json-nested"), O = m.length <= 5 && D <= 2;
      if (M.textContent = O ? "▼" : "▶", O || v.classList.add("ph-collapsed"), S !== void 0) {
        const L = y("span", "ph-tree-key");
        L.textContent = S + ": ", k.appendChild(L);
      }
      k.appendChild(M);
      const P = y("span", "ph-json-bracket");
      P.textContent = "[", k.appendChild(P);
      const X = y("span", "ph-json-count");
      X.textContent = String(m.length), k.appendChild(X);
      const V = y("span", "ph-json-bracket");
      V.textContent = "]", k.appendChild(V), k.onclick = (L) => {
        L.stopPropagation();
        const J = v.classList.toggle("ph-collapsed");
        M.textContent = J ? "▶" : "▼";
      };
      for (let L = 0; L < m.length; L++)
        rn(v, m[L], D + 1, String(L));
      C.appendChild(k), C.appendChild(v);
      return;
    }
    if (typeof m == "object") {
      const k = Object.keys(m), M = y("div", "ph-json-row ph-json-expandable"), v = y("span", "ph-json-toggle"), O = y("div", "ph-json-nested"), P = k.length <= 5 && D <= 2;
      if (v.textContent = P ? "▼" : "▶", P || O.classList.add("ph-collapsed"), S !== void 0) {
        const J = y("span", "ph-tree-key");
        J.textContent = S + ": ", M.appendChild(J);
      }
      M.appendChild(v);
      const X = y("span", "ph-json-bracket");
      X.textContent = "{", M.appendChild(X);
      const V = y("span", "ph-json-count");
      V.textContent = String(k.length), M.appendChild(V);
      const L = y("span", "ph-json-bracket");
      L.textContent = "}", M.appendChild(L), M.onclick = (J) => {
        J.stopPropagation();
        const ve = O.classList.toggle("ph-collapsed");
        v.textContent = ve ? "▶" : "▼";
      };
      for (const J of k)
        rn(O, m[J], D + 1, J);
      C.appendChild(M), C.appendChild(O);
      return;
    }
    const W = y("div", "ph-json-row");
    if (S !== void 0) {
      const k = y("span", "ph-tree-key");
      k.textContent = S + ": ", W.appendChild(k);
    }
    W.appendChild(document.createTextNode(String(m))), C.appendChild(W);
  }
  function Yc(C, m, D) {
    if (m == null) {
      const S = y("span", "ph-json-null");
      S.textContent = String(m), C.appendChild(S);
    } else if (typeof m == "object" && !Array.isArray(m))
      for (const [S, W] of Object.entries(m))
        rn(C, W, D, S);
    else
      rn(C, m, D);
  }
  let Ut = "", Ce = "";
  function se() {
    ft.innerHTML = "";
    const C = y("div", "ph-search-bar"), m = y("input", "ph-search-input");
    m.type = "text", m.placeholder = "Search by element ID...", m.value = Ut;
    let D;
    m.oninput = () => {
      Ut = m.value, clearTimeout(D), D = setTimeout(() => se(), 150);
    }, C.appendChild(m);
    const S = /* @__PURE__ */ new Set();
    if (n.forEach((v, O) => S.add(O)), S.size > 1) {
      const v = y("select", "ph-tag-filter"), O = document.createElement("option");
      O.value = "", O.textContent = "All types", v.appendChild(O), S.forEach((P) => {
        const X = document.createElement("option");
        X.value = P, X.textContent = P, v.appendChild(X);
      }), v.value = Ce, v.onchange = () => {
        Ce = v.value, se();
      }, C.appendChild(v);
    }
    const W = y("button", "ph-reset-btn");
    W.textContent = "Reset All", W.onclick = () => {
      window.confirm("Reset all playhtml element data?") && (n.forEach((v) => {
        v.forEach((O) => {
          O.setData(O.defaultData);
        });
      }), se());
    }, C.appendChild(W), ft.appendChild(C), requestAnimationFrame(() => {
      Ut && (m.focus(), m.setSelectionRange(Ut.length, Ut.length));
    });
    let k = !1;
    if (n.forEach((v) => {
      v.size > 0 && (k = !0);
    }), k) {
      let v = 0;
      if (n.forEach((O, P) => {
        Ce && P !== Ce || O.forEach((X, V) => {
          if (Ut && !V.toLowerCase().includes(Ut.toLowerCase())) return;
          v++;
          const L = y("div", "ph-tree-item");
          L.setAttribute("data-element-id", V), L.setAttribute("data-tag-type", P);
          const J = y("span", "ph-tree-toggle");
          J.textContent = "▶";
          const ve = y("span", "ph-tree-badge");
          ve.textContent = P, ve.style.background = od[P] || cd;
          const $r = y("span", "ph-tree-el-name");
          $r.textContent = `#${V}`;
          const as = y("button", "ph-tree-reset");
          as.textContent = "reset", as.onclick = (et) => {
            et.stopPropagation(), X.setData(X.defaultData), se();
          }, L.onmouseenter = () => {
            const et = document.getElementById(V);
            et && et.classList.add("ph-inspect-highlight", "ph-inspect-highlight-hover");
          }, L.onmouseleave = () => {
            const et = document.getElementById(V);
            et && et.classList.remove("ph-inspect-highlight", "ph-inspect-highlight-hover");
          }, L.appendChild(J), L.appendChild(ve), L.appendChild($r), L.appendChild(as);
          const cn = y("div", "ph-tree-children");
          Yc(cn, X.data, 0);
          function Yr() {
            const et = cn.classList.toggle("ph-expanded");
            J.textContent = et ? "▼" : "▶";
          }
          J.onclick = (et) => {
            et.stopPropagation(), Yr();
          }, L.onclick = (et) => {
            const Kr = et.target;
            if (Kr.closest(".ph-tree-toggle") || Kr.closest(".ph-tree-reset")) return;
            const Ae = document.getElementById(V);
            Ae && (Ae.scrollIntoView({ behavior: "smooth", block: "center" }), Ae.classList.add("ph-flash"), Ae.addEventListener(
              "animationend",
              () => Ae.classList.remove("ph-flash"),
              { once: !0 }
            )), cn.classList.contains("ph-expanded") || Yr();
          }, ft.appendChild(L), ft.appendChild(cn);
        });
      }), v === 0 && (Ut || Ce)) {
        const O = y("div", "ph-empty");
        O.textContent = "No elements match the current filter.", ft.appendChild(O);
      }
    } else {
      const v = y("div", "ph-empty");
      v.textContent = "No playhtml elements found.", ft.appendChild(v);
    }
    const M = Ac();
    if (M.length > 0) {
      const v = document.createElement("hr");
      v.style.border = "none", v.style.borderTop = "1px solid #d4cfc7", v.style.margin = "6px 0", ft.appendChild(v);
      const O = y("div", "ph-data-header");
      O.textContent = "Shared Elements", O.style.fontSize = "10px", ft.appendChild(O);
      for (const P of M) {
        const X = y("div", "ph-tree-item"), V = y("span", "ph-tree-badge");
        P.type === "source" ? (V.textContent = "SRC", V.style.background = "#4a9a8a") : (V.textContent = "REF", V.style.background = "#5b8db8");
        const L = y("span", "ph-tree-el-name");
        L.textContent = `#${P.elementId}`, L.title = P.dataSource, L.onclick = (J) => {
          J.stopPropagation(), P.element.scrollIntoView({ behavior: "smooth", block: "center" }), P.element.classList.add("ph-flash"), P.element.addEventListener(
            "animationend",
            () => P.element.classList.remove("ph-flash"),
            { once: !0 }
          );
        }, X.appendChild(V), X.appendChild(L), ft.appendChild(X);
      }
    }
  }
  let on = 400;
  const Kc = document.body.style.marginRight;
  function Gc() {
    a.style.display = "none", d.classList.add("ph-open"), document.body.style.marginRight = `${on}px`, cs(), se();
  }
  function Wc() {
    a.style.display = "", d.classList.remove("ph-open"), document.body.style.marginRight = Kc, r && (r = !1, E.classList.remove("ph-active"), Vr());
  }
  let ls = 0;
  n.forEach((C) => {
    ls += C.size;
  }), new MutationObserver((C) => {
    for (const D of C)
      if (l.contains(D.target)) return;
    let m = 0;
    n.forEach((D) => {
      m += D.size;
    }), m !== ls && (ls = m, d.classList.contains("ph-open") && (cs(), se()));
  }).observe(document.body, {
    childList: !0,
    subtree: !0
  }), a.addEventListener("click", () => Gc()), G.onclick = () => Wc(), f.addEventListener("mousedown", (C) => {
    C.preventDefault();
    const m = (S) => {
      on = Math.max(280, Math.min(700, window.innerWidth - S.clientX)), d.style.width = `${on}px`, document.body.style.marginRight = `${on}px`;
    }, D = () => {
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", D);
    };
    document.addEventListener("mousemove", m), document.addEventListener("mouseup", D);
  });
  function Xc(C) {
    let m = null;
    return n.forEach((D, S) => {
      D.has(C) && (m = { tagType: S, handler: D.get(C) });
    }), m;
  }
  function Jc(C) {
    const m = ft.querySelector(
      `.ph-tree-item[data-element-id="${C}"]`
    );
    if (!m) return;
    m.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const D = m.nextElementSibling;
    if (D && D.classList.contains("ph-tree-children")) {
      D.classList.add("ph-expanded");
      const S = m.querySelector(".ph-tree-toggle");
      S && (S.textContent = "▼");
    }
  }
  function Zc() {
    document.querySelectorAll("[class*='__playhtml-']").forEach((m) => {
      const D = m;
      D.classList.add("ph-inspect-highlight");
      const S = D.id;
      if (S) {
        const W = y("div", "ph-inspect-label");
        W.textContent = `#${S}`, D.appendChild(W), c.push(W);
      }
    });
  }
  function Vr() {
    document.querySelectorAll(
      ".ph-inspect-highlight, .ph-inspect-highlight-hover, .ph-inspect-selected"
    ).forEach((C) => {
      C.classList.remove(
        "ph-inspect-highlight",
        "ph-inspect-highlight-hover",
        "ph-inspect-selected"
      );
    });
    for (const C of c)
      C.remove();
    c.length = 0, o = null;
  }
  E.onclick = () => {
    r = !r, E.classList.toggle("ph-active", r), r ? Zc() : Vr();
  }, document.addEventListener("mousemove", (C) => {
    if (!r) return;
    const m = C.target.closest(
      "[class*='__playhtml-']"
    );
    m && m !== o ? (o && o.classList.remove("ph-inspect-highlight-hover"), o = m, m.classList.add("ph-inspect-highlight-hover")) : m || o && (o.classList.remove("ph-inspect-highlight-hover"), o = null);
  }), document.addEventListener(
    "click",
    (C) => {
      if (!r) return;
      const m = document.getElementById("playhtml-dev-root");
      if (m && m.contains(C.target)) return;
      const D = C.target.closest(
        "[class*='__playhtml-']"
      );
      if (D) {
        C.preventDefault(), C.stopPropagation(), document.querySelectorAll(".ph-inspect-selected").forEach((k) => k.classList.remove("ph-inspect-selected")), D.classList.add("ph-inspect-selected");
        const S = D.id;
        i = S || null;
        const W = S ? Xc(S) : null;
        W && console.log(
          `[playhtml inspect] ${W.tagType} #${i}`,
          W.handler.data
        ), S && Jc(S);
      }
    },
    !0
  );
}
function He() {
  return He = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, He.apply(this, arguments);
}
function hd(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, js(e, t);
}
function js(e, t) {
  return js = Object.setPrototypeOf || function(s, r) {
    return s.__proto__ = r, s;
  }, js(e, t);
}
function ud(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
var Sc = /* @__PURE__ */ (function() {
  function e(n) {
    this.trigger = n, this.observing = /* @__PURE__ */ new Map();
  }
  var t = e.prototype;
  return t.registerConnection = function(s) {
    var r = this.observing.get(s.observable);
    r || (r = {
      byKey: /* @__PURE__ */ new Set(),
      iterate: !1
    }, this.observing.set(s.observable, r)), s.type === "iterate" ? r.iterate = !0 : r.byKey.add(s.key);
  }, t.removeObservers = function() {
    var s = this;
    this.observing.forEach(function(r, i) {
      r.iterate && i[F].connections.iterate.delete(s), r.byKey.forEach(function(o) {
        i[F].connections.byKey.get(o).delete(s);
      });
    }), this.observing.clear();
  }, e;
})(), Gt = [], qn = /* @__PURE__ */ (function(e) {
  hd(t, e);
  function t(s, r, i) {
    var o;
    if (o = e.call(this, function() {
      return o._trigger();
    }) || this, o.func = s, o.options = r, o.effect = i, o.isInitial = !0, o.reaction = function() {
      Gt.push(ud(o));
      try {
        o.func();
      } finally {
        Gt.pop();
      }
      o.effect && (!o.isInitial || o.options.fireImmediately) && o.effect(), o.isInitial = !1;
    }, !i && !o.options.fireImmediately)
      throw new Error("if no effect function passed, should always fireImmediately");
    return o.reaction(), o;
  }
  var n = t.prototype;
  return n._trigger = function() {
    if (Gt.includes(this))
      throw new Error("already running reaction");
    this.removeObservers(), this.reaction();
  }, t;
})(Sc);
function Ec() {
  return !!Gt.length;
}
function kc() {
  return Gt.length ? Gt[Gt.length - 1] : void 0;
}
function dd(e, t, n) {
  var s = He({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new qn(e, s, t);
  return r;
}
var vn = 0;
function Dc() {
  return vn > 0;
}
function zs(e) {
  vn++;
  try {
    return e();
  } finally {
    vn--, vn === 0 && pd();
  }
}
var Fs = !1;
function _c() {
  return Fs;
}
function Mc(e) {
  Fs = !0;
  try {
    e();
  } finally {
    Fs = !1;
  }
}
function fd(e) {
  return function() {
    return Mc(e);
  };
}
var Hs = [];
function pd() {
  var e = [].concat(Hs);
  Hs = [], Ic(e);
}
function Ic(e) {
  var t = /* @__PURE__ */ new Set();
  e.forEach(function(n) {
    var s;
    (n.type === "add" || n.type === "delete") && n.observable[F].connections.iterate.forEach(function(r) {
      t.add(r);
    }), (s = n.observable[F].connections.byKey.get(n.key)) == null || s.forEach(function(r) {
      t.add(r);
    });
  }), t.forEach(function(n) {
    n.trigger();
  });
}
function fn(e) {
  if (Dc()) {
    Hs.push(e);
    return;
  }
  Ic([e]);
}
function Di(e, t) {
  if (e.type === "iterate")
    e.observable[F].connections.iterate.add(t);
  else {
    var n = e.observable[F].connections.byKey.get(e.key);
    n || (n = /* @__PURE__ */ new Set(), e.observable[F].connections.byKey.set(e.key, n)), n.add(t);
  }
}
function pn(e, t) {
  if (!_c()) {
    var n = kc();
    n && (Di(e, n), n.registerConnection(e)), t && (Di(e, t), t.registerConnection(e));
  }
}
var Mr = /* @__PURE__ */ Symbol("$skipreactive"), F = /* @__PURE__ */ Symbol("$reactive"), dt = /* @__PURE__ */ Symbol("$reactiveproxy");
function en(e, t) {
  return !!(e && e[dt] && e[dt].implicitObserver === t);
}
function Ir(e) {
  return e[Mr] = !0, e;
}
function Lc(e) {
  return !!(e && !en(e) && e[F]);
}
function Vs(e, t, n) {
  if (n === void 0 && (n = !1), e[Mr] || en(e, t))
    return e;
  var s = gd(e, n);
  if (!t)
    return s;
  var r = s[F].proxiesWithImplicitObserver.get(t);
  if (!r) {
    var i = {
      implicitObserver: t
    };
    Object.setPrototypeOf(i, Tc), r = new Proxy(s[F].raw, i), s[F].proxiesWithImplicitObserver.set(t, r);
  }
  return r;
}
var Ve = Vs;
function gd(e, t) {
  if (t === void 0 && (t = !1), en(e))
    return e;
  if (Lc(e))
    return e[F].proxy;
  if (e[F] || e[dt])
    throw new Error("unexpected");
  var n = {
    connections: {
      iterate: /* @__PURE__ */ new Set(),
      byKey: /* @__PURE__ */ new Map()
    },
    proxy: {},
    raw: e,
    proxiesWithImplicitObserver: /* @__PURE__ */ new Map(),
    shallow: t
  };
  Object.defineProperty(e, F, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
  var s = new Proxy(e, Tc);
  return n.proxy = s, s;
}
var Tc = {
  // Read:
  has: function(t, n) {
    var s = Reflect.has(t, n);
    return typeof n == "symbol" || pn({
      observable: t,
      key: n,
      type: "has"
    }, this.implicitObserver), s;
  },
  get: function(t, n, s) {
    if (n === dt)
      return {
        implicitObserver: this.implicitObserver
      };
    var r = Reflect.get(t, n, s);
    if (typeof n == "symbol")
      return n.toString() === "Symbol($reactiveproxy)" && console.error("warning, Symbol($reactiveproxy) passed, but does not match $reactiveproxy. Multiple Reactive libraries loaded?"), r;
    if (n === "length" && Array.isArray(t) ? pn({
      observable: t,
      type: "iterate"
    }, this.implicitObserver) : pn({
      observable: t,
      key: n,
      type: "get"
    }, this.implicitObserver), Lc(r))
      return Vs(r, this.implicitObserver);
    if (t[F].shallow)
      return r;
    if (typeof r == "object" && r !== null && !en(r, this.implicitObserver) && !Object.isFrozen(r)) {
      var i = Reflect.getOwnPropertyDescriptor(t, n);
      if ((!i || !(i.writable === !1 && i.configurable === !1)) && (Ec() || this.implicitObserver))
        return Vs(r, this.implicitObserver);
    }
    return r;
  },
  ownKeys: function(t) {
    return pn({
      observable: t,
      type: "iterate"
    }, this.implicitObserver), Reflect.ownKeys(t);
  },
  // Write:
  set: function(t, n, s, r) {
    return zs(function() {
      if (typeof n == "symbol")
        return Reflect.set(t, n, s, r);
      var i = Object.hasOwnProperty.call(t, n), o = Reflect.get(t, n, r), c = Reflect.set(t, n, s, r);
      if (!i)
        fn({
          observable: t,
          key: n,
          value: s,
          type: "add"
        });
      else if (s !== o)
        if (n === "length" && Array.isArray(t)) {
          if (!(o < s))
            for (var l = s + 1; l <= o; l++)
              fn({
                observable: t,
                key: "" + (l - 1),
                oldValue: void 0,
                type: "delete"
              });
        } else
          fn({
            observable: t,
            key: n,
            value: s,
            oldValue: o,
            type: "update"
          });
      return c;
    });
  },
  deleteProperty: function(t, n) {
    return zs(function() {
      if (typeof n == "symbol")
        return Reflect.deleteProperty(t, n);
      var s = Object.hasOwnProperty.call(t, n), r = Reflect.get(t, n), i = Reflect.deleteProperty(t, n);
      return s && fn({
        observable: t,
        key: n,
        oldValue: r,
        type: "delete"
      }), i;
    });
  },
  preventExtensions: function(t) {
    throw new Error("Dynamic observable objects cannot be frozen");
  }
};
function yd(e, t) {
  var n = He({
    name: "unnamed",
    fireImmediately: !0
  }, t), s = new qn(e, n);
  return s;
}
function md(e, t, n) {
  var s = He({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new qn(function() {
    e(t);
  }, s);
  return t = Ve(t, r), s.fireImmediately && r.trigger(), r;
}
var Oc = /* @__PURE__ */ (function() {
  function e() {
    this._observable = Ve({
      _key: 1
    });
  }
  var t = e.prototype;
  return t.reportObserved = function(s) {
    return Ve(this._observable, s)._key;
  }, t.reportChanged = function() {
    this._observable._key++;
  }, e;
})();
function wd(e, t, n) {
  return new Oc();
}
const bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $reactive: F,
  $reactiveproxy: dt,
  $skipreactive: Mr,
  Atom: Oc,
  Observer: Sc,
  Reaction: qn,
  autorun: yd,
  autorunAsync: md,
  createAtom: wd,
  hasRunningReaction: Ec,
  isActionRunning: Dc,
  isReactive: en,
  isTrackingDisabled: _c,
  markRaw: Ir,
  reaction: dd,
  reactive: Ve,
  runInAction: zs,
  runningReaction: kc,
  untracked: Mc,
  untrackedCB: fd
}, Symbol.toStringTag, { value: "Module" }));
let $s, Ys, xd = (e) => e();
function Cd(e, t) {
  if (Ys)
    return Ys(e, t);
  xd(e);
}
function Qt(e, t, n) {
  if ($s)
    return $s.apply(null, arguments);
  throw new Error("observable implementation not provided. Call enableReactiveBindings, enableVueBindings or enableMobxBindings.");
}
function vd(e) {
  $s = function(t, n, s) {
    const r = e.createAtom(t);
    return n && n(), r;
  }, Ys = (t, n) => e.reaction(t, n, {
    fireImmediately: !1
  });
}
const _i = /* @__PURE__ */ new WeakSet();
function Ad(e) {
  if (_i.has(e))
    return e;
  _i.add(e);
  let t;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!t) {
      const u = (d) => {
        (d.changes.added.size || d.changes.deleted.size || d.changes.keys.size || d.changes.delta.length) && t.reportChanged();
      };
      t = Qt("map", () => {
        e.observe(u);
      }, () => {
        e.unobserve(u);
      });
    }
    t.reportObserved(e._implicitObserver);
  }
  function r(u) {
    let d = n.get(u);
    if (!d) {
      const f = (p) => {
        d.reportChanged();
      };
      d = Qt(u + "", () => {
        e.observe(f);
      }, () => {
        e.unobserve(f);
      }), n.set(u, d);
    }
    d.reportObserved(e._implicitObserver);
  }
  const i = e.get;
  e.get = function(u) {
    if (typeof u != "number")
      throw new Error("unexpected");
    return r(u), Reflect.apply(i, this, arguments);
  };
  function o(u) {
    const d = e[u];
    e[u] = function() {
      return s(), Reflect.apply(d, this, arguments);
    };
  }
  function c(u) {
    let d = e, f = Object.getOwnPropertyDescriptor(d, u);
    if (f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, u)), f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, u)), !f)
      throw new Error("property not found");
    const p = f.get;
    f.get = function() {
      return this._disableTracking || s(), Reflect.apply(p, this, arguments);
    }, Object.defineProperty(e, u, f);
  }
  function l(u, d) {
    let f = e, p = Object.getOwnPropertyDescriptor(f, u);
    if (p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, u)), p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, u)), !p)
      throw new Error("property not found");
    Object.defineProperty(e, d, p);
  }
  o("forEach"), o("toJSON"), o("toArray"), o("slice"), o("map"), l("length", "lengthUntracked"), c("length");
  const a = e.push;
  e.push = function(u) {
    this._disableTracking = !0;
    const d = a.call(this, u);
    return this._disableTracking = !1, d;
  };
  const h = e.slice;
  return e.slice = function(u, d) {
    this._disableTracking = !0;
    const f = h.call(this, u, d);
    return this._disableTracking = !1, f;
  }, e;
}
const Mi = /* @__PURE__ */ new WeakSet();
function Sd(e) {
  if (Mi.has(e))
    return e;
  Mi.add(e);
  let t;
  function n() {
    if (!t) {
      let i = Array.from(e.share.keys());
      const o = (c) => {
        const l = Array.from(e.share.keys());
        JSON.stringify(i) !== JSON.stringify(l) && (i = l, t.reportChanged());
      };
      t = Qt("map", () => {
        e.on("beforeObserverCalls", o);
      }, () => {
        e.off("beforeObserverCalls", o);
      });
    }
    t.reportObserved(e._implicitObserver);
  }
  const s = e.get;
  e.get = function(i) {
    if (typeof i != "string")
      throw new Error("unexpected");
    const o = Reflect.apply(s, this, arguments);
    return Qn(o), o;
  };
  function r(i) {
    const o = e[i];
    let c;
    e[i] = function() {
      let l, a = arguments;
      return n(), c && c.removeObservers(), c = Cd(() => (l = Reflect.apply(o, e, a), l), () => t.reportChanged()), l;
    };
  }
  return r("toJSON"), Object.defineProperty(e, "keys", {
    get: () => (n(), Object.keys(e.share))
  }), e;
}
const Ii = /* @__PURE__ */ new WeakSet();
function Ed(e) {
  if (Ii.has(e))
    return e;
  Ii.add(e);
  let t;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!t) {
      const c = (l) => {
        (l.changes.added.size || l.changes.deleted.size || l.changes.keys.size || l.changes.delta.length) && t.reportChanged();
      };
      t = Qt("map", () => {
        e.observe(c);
      }, () => {
        e.unobserve(c);
      });
    }
    t.reportObserved(e._implicitObserver);
  }
  function r(c) {
    let l = n.get(c);
    if (!l) {
      const a = (h) => {
        h.keysChanged.has(c) && (h.changes.added.size || h.changes.deleted.size || h.changes.keys.size || h.changes.delta.length) && l.reportChanged();
      };
      l = Qt(c, () => {
        e.observe(a);
      }, () => {
        e.unobserve(a);
      }), n.set(c, l);
    }
    l.reportObserved(e._implicitObserver);
  }
  const i = e.get;
  e.get = function(c) {
    if (typeof c != "string")
      throw new Error("unexpected");
    return r(c), Reflect.apply(i, this, arguments);
  };
  function o(c) {
    const l = e[c];
    e[c] = function() {
      return s(), Reflect.apply(l, this, arguments);
    };
  }
  return o("values"), o("entries"), o("keys"), o("forEach"), o("toJSON"), e;
}
const Li = /* @__PURE__ */ new WeakSet();
function Ti(e) {
  if (Li.has(e))
    return e;
  Li.add(e);
  let t;
  const n = (r) => {
    t.reportChanged();
  };
  t = Qt("text", () => {
    e.observe(n);
  }, () => {
    e.unobserve(n);
  });
  function s(r) {
    const i = e[r];
    e[r] = function() {
      return t.reportObserved(this._implicitObserver), Reflect.apply(i, this, arguments);
    };
  }
  return s("toString"), s("toJSON"), e;
}
const Oi = /* @__PURE__ */ new WeakSet();
function Ri(e) {
  if (Oi.has(e))
    return e;
  Oi.add(e);
  let t;
  const n = (i) => {
    (i.changes.added.size || i.changes.deleted.size || i.changes.keys.size || i.changes.delta.length) && t.reportChanged();
  };
  t = Qt("xml", () => {
    e.observe(n);
  }, () => {
    e.unobserve(n);
  });
  function s(i) {
    const o = e[i];
    e[i] = function() {
      return t.reportObserved(this._implicitObserver), Reflect.apply(o, this, arguments);
    };
  }
  function r(i) {
    let o = e, c = Object.getOwnPropertyDescriptor(o, i);
    if (c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), !c)
      throw new Error("property not found");
    const l = c.get;
    c.get = function() {
      return t.reportObserved(this._implicitObserver), Reflect.apply(l, this, arguments);
    }, Object.defineProperty(e, i, c);
  }
  return s("toString"), s("toDOM"), s("toArray"), s("getAttribute"), r("firstChild"), e;
}
function Qn(e) {
  return e instanceof Zt || e instanceof Lt ? Ti(e) : e instanceof xt ? Ad(e) : e instanceof At ? Ed(e) : e instanceof mt || Object.prototype.hasOwnProperty.call(e, "autoLoad") ? Sd(e) : e instanceof St || e instanceof Tt ? Ri(e) : e;
}
function Ni(e) {
  e.share.forEach((t) => {
    t.constructor !== U && Qn(t);
  });
}
function Ui(e, t) {
  for (let s = e.length - 1; s >= t; s--) {
    let r = e[s];
    if (!r.deleted) {
      var n;
      if (r instanceof nt)
        continue;
      (n = r.content) == null || n.getContent().forEach((i) => {
        i instanceof U && Qn(i);
      });
    }
  }
}
const Pi = /* @__PURE__ */ new WeakSet();
function kd(e) {
  Pi.has(e) || (Pi.add(e), Qn(e), e.store.clients.forEach((t) => {
    t && Ui(t, 0);
  }), Ni(e), e.on("beforeObserverCalls", (t) => {
    Ni(e), t.afterState.forEach((n, s) => {
      const r = t.beforeState.get(s) || 0;
      if (r !== n) {
        const i = t.doc.store.clients.get(s);
        if (!i)
          return;
        const o = yt(i, r);
        Ui(i, o);
      }
    });
  }));
}
class $e {
  constructor(t) {
    this.value = void 0, this.value = t;
  }
}
function Dd(e) {
  return ArrayBuffer.isView(e) ? new $e(e) : new $e(Object.freeze(e));
}
function _d(e) {
  const t = function() {
    var c;
    let l = (c = this[dt]) == null ? void 0 : c.implicitObserver;
    return e._implicitObserver = l, e.slice.bind(e).apply(e, arguments).map((h) => {
      const u = ts(h, l);
      return l && typeof u == "object" ? Ve(u, l) : u;
    });
  }, n = function(c) {
    return c.map((l) => {
      const a = Lr(l);
      let h = kt(a) || a;
      if (h instanceof $e && (h = h.value), h instanceof U && h.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return h;
    });
  }, s = function() {
    return [].findIndex.apply(t.apply(this), arguments);
  }, r = {
    // get length() {
    //   return arr.length;
    // },
    // set length(val: number) {
    //   throw new Error("set length of yjs array is unsupported");
    // },
    slice: t,
    unshift: (...o) => (e.unshift(n(o)), e.lengthUntracked),
    push: (...o) => (e.push(n(o)), e.lengthUntracked),
    insert: e.insert.bind(e),
    toJSON: e.toJSON.bind(e),
    forEach: function() {
      return [].forEach.apply(t.apply(this), arguments);
    },
    every: function() {
      return [].every.apply(t.apply(this), arguments);
    },
    filter: function() {
      return [].filter.apply(t.apply(this), arguments);
    },
    find: function() {
      return [].find.apply(t.apply(this), arguments);
    },
    findIndex: s,
    some: function() {
      return [].some.apply(t.apply(this), arguments);
    },
    includes: function() {
      return [].includes.apply(t.apply(this), arguments);
    },
    map: function() {
      return [].map.apply(t.apply(this), arguments);
    },
    indexOf: function() {
      const o = arguments[0];
      return s.call(this, (c) => Od(c, o));
    },
    splice: function() {
      let o = arguments[0] < 0 ? e.length - Math.abs(arguments[0]) : arguments[0], c = arguments[1], l = Array.from(Array.from(arguments).slice(2)), a = t.apply(this, [o, Number.isInteger(c) ? o + c : void 0]);
      return e.doc ? e.doc.transact(() => {
        e.delete(o, c), e.insert(o, n(l));
      }) : (e.delete(o, c), e.insert(o, n(l))), a;
    }
    // toJSON = () => {
    //   return this.arr.toJSON() slice();
    // };
    // delete = this.arr.delete.bind(this.arr) as (Y.Array<T>)["delete"];
  }, i = [];
  for (let o in r)
    i[o] = r[o];
  return i;
}
function Se(e) {
  if (typeof e == "string" && e.trim().length) {
    const t = Number(e);
    if (Number.isInteger(t))
      return t;
  }
  return e;
}
function Bi(e, t = new xt()) {
  if (t[F])
    throw new Error("unexpected");
  const n = _d(t), s = new Proxy(n, {
    set: (r, i, o) => {
      throw typeof Se(i) != "number" ? new Error() : new Error("array assignment is not implemented / supported");
    },
    get: (r, i, o) => {
      const c = Se(i);
      if (c === es)
        return t;
      if (typeof c == "number") {
        let h;
        if (o && o[dt]) {
          var l;
          h = (l = o[dt]) == null ? void 0 : l.implicitObserver, t._implicitObserver = h;
        }
        let u = t.get(c);
        return u = ts(u, h), u;
      }
      if (c === Symbol.toStringTag)
        return "Array";
      if (c === Symbol.iterator) {
        const h = t.slice();
        return Reflect.get(h, c);
      }
      return c === "length" ? t.length : Reflect.get(r, c, o);
    },
    // getOwnPropertyDescriptor: (target, pArg) => {
    //   const p = propertyToNumber(pArg);
    //   if (typeof p === "number" && p < arr.length && p >= 0) {
    //     return { configurable: true, enumerable: true, value: arr.get(p) };
    //   } else {
    //     return undefined;
    //   }
    // },
    deleteProperty: (r, i) => {
      const o = Se(i);
      if (typeof o != "number")
        throw new Error();
      return o < t.lengthUntracked && o >= 0 ? (t.delete(o), !0) : !1;
    },
    has: (r, i) => {
      const o = Se(i);
      return typeof o != "number" ? Reflect.has(r, o) : o < t.lengthUntracked && o >= 0;
    },
    getOwnPropertyDescriptor(r, i) {
      const o = Se(i);
      if (o === "length")
        return {
          enumerable: !1,
          configurable: !1,
          writable: !0
        };
      if (typeof o == "number" && o >= 0 && o < t.lengthUntracked)
        return {
          enumerable: !0,
          configurable: !0,
          writable: !0
        };
    },
    ownKeys: (r) => {
      const i = [];
      for (let o = 0; o < t.length; o++)
        i.push(o + "");
      return i.push("length"), i;
    }
  });
  return n.push.apply(s, e), s;
}
function ji(e, t = new At()) {
  if (t[F])
    throw new Error("unexpected");
  const n = new Proxy({}, {
    set: (s, r, i) => {
      if (typeof r != "string")
        throw new Error();
      const o = Lr(i);
      let c = kt(o) || o;
      if (c instanceof $e && (c = c.value), c instanceof U && c.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return t.set(r, c), !0;
    },
    get: (s, r, i) => {
      if (r === es)
        return t;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[dt]) {
        var c;
        o = (c = i[dt]) == null ? void 0 : c.implicitObserver, t._implicitObserver = o;
      }
      let l = t.get(r);
      return l = ts(l, o), l;
    },
    deleteProperty: (s, r) => {
      if (typeof r != "string")
        throw new Error();
      return t.has(r) ? (t.delete(r), !0) : !1;
    },
    has: (s, r) => !!(typeof r == "string" && t.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && t.has(r))
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(t.keys())
  });
  Ie.set(t, n);
  for (let s in e)
    n[s] = e[s];
  return n;
}
function Md(e) {
  return e instanceof U;
}
const Ie = /* @__PURE__ */ new WeakMap();
function ts(e, t) {
  if (Md(e)) {
    if (e._implicitObserver = t, e instanceof xt || e instanceof At) {
      if (!Ie.has(e)) {
        const n = Lr(e);
        Ie.set(e, n);
      }
      e = Ie.get(e);
    } else if (e instanceof Tt || e instanceof St || e instanceof Zt || e instanceof ye || e instanceof Lt)
      Ir(e), e.__v_skip = !0;
    else
      throw new Error("unknown YType");
    return e;
  } else {
    if (e === null)
      return null;
    if (typeof e == "object")
      return Dd(e);
  }
  return e;
}
function Lr(e) {
  if (e == null)
    return e;
  if (e = kt(e) || e, e instanceof xt)
    return Bi([], e);
  if (e instanceof At)
    return ji({}, e);
  if (typeof e == "string")
    return e;
  if (Array.isArray(e))
    return Bi(e);
  if (e instanceof Tt || e instanceof St || e instanceof Zt || e instanceof ye)
    return e;
  if (e instanceof Lt)
    return e;
  if (typeof e == "object")
    return e instanceof $e ? e : ji(e);
  if (typeof e == "number" || typeof e == "boolean")
    return e;
  throw new Error("invalid");
}
function Id(e) {
  for (let [t, n] of Object.entries(e))
    if (Array.isArray(n)) {
      if (n.length !== 0)
        throw new Error("Root Array initializer must always be empty array");
    } else if (n && typeof n == "object") {
      if (Object.keys(n).length !== 0 || Object.getPrototypeOf(n) !== Object.prototype)
        throw new Error("Root Object initializer must always be {}");
    } else if (n !== "xml" && n !== "text")
      throw new Error("unknown Root initializer");
}
function zi(e, t, n) {
  let s = t[n];
  if (!s) {
    n !== "__v_raw" && n !== "__v_isRef" && n !== "__v_isReadonly" && console.warn("property not found on root doc", n);
    return;
  }
  return s === "xml" ? e.getXmlFragment(n) : s === "text" ? e.getText(n) : Array.isArray(s) ? e.getArray(n) : e.getMap(n);
}
function Ld(e, t) {
  if (e[F])
    throw new Error("unexpected");
  Id(t);
  const n = new Proxy({}, {
    set: (s, r, i) => {
      throw typeof r != "string" ? new Error() : new Error("cannot set new elements on root doc");
    },
    get: (s, r, i) => {
      if (r === es)
        return e;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[dt]) {
        var c;
        o = (c = i[dt]) == null ? void 0 : c.implicitObserver, e._implicitObserver = o;
      }
      if (r === "toJSON") {
        for (let h of Object.keys(t))
          zi(e, t, h);
        return Reflect.get(e, r);
      }
      let l = zi(e, t, r);
      return l = ts(l, o), l;
    },
    deleteProperty: (s, r) => {
      throw new Error("deleteProperty not available for doc");
    },
    has: (s, r) => !!(typeof r == "string" && e.share.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && e.share.has(r) || r === "toJSON")
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(e.share.keys())
  });
  return Ie.set(e, n), n;
}
vd(bd);
const es = /* @__PURE__ */ Symbol("INTERNAL_SYMBOL");
function Td(e) {
  const t = kt(e);
  if (!(t instanceof mt))
    throw new Error("store is not a valid syncedStore that maps to a Y.Doc");
  return t;
}
function kt(e) {
  if (typeof e != "object" || e === null)
    return;
  const t = e[es];
  return t && (Ir(t), t.__v_skip = !0), t;
}
function Od(e, t) {
  if (e === t)
    return !0;
  if (typeof e == "object" && typeof t == "object") {
    const n = kt(e), s = kt(t);
    return !n || !s ? !1 : n === s;
  }
  return !1;
}
function Rd(e, t = new mt()) {
  return kd(t), Ld(t, e);
}
const Fi = (e, t = 300) => {
  let n;
  return function(...s) {
    clearTimeout(n), n = setTimeout(() => e.apply(this, s), t);
  };
};
class Nd {
  defaultData;
  localData;
  awareness = [];
  awarenessByStableId = /* @__PURE__ */ new Map();
  selfAwareness;
  element;
  _data;
  onChange;
  onAwarenessChange;
  debouncedOnChange;
  resetShortcut;
  // TODO: change this to receive the delta instead of the whole data object so you don't have to maintain
  // internal state for expressing the delta.
  updateElement;
  updateElementAwareness;
  triggerAwarenessUpdate;
  // event handlers
  onClick;
  onDrag;
  onDragStart;
  constructor(t) {
    const {
      element: n,
      onChange: s,
      onAwarenessChange: r,
      defaultData: i,
      defaultLocalData: o,
      myDefaultAwareness: c,
      data: l,
      awareness: a,
      updateElement: h,
      updateElementAwareness: u,
      onMount: d,
      debounceMs: f,
      triggerAwarenessUpdate: p
    } = t;
    this.element = n, this.defaultData = i instanceof Function ? i(n) : i, this.localData = o instanceof Function ? o(n) : o, this.triggerAwarenessUpdate = p, this.onChange = s, this.debouncedOnChange = Fi(this.onChange, f), this.onAwarenessChange = r, this.updateElement = h, this.updateElementAwareness = u;
    const g = l === void 0 ? this.defaultData : l;
    a !== void 0 && (this.awareness = a);
    const w = c instanceof Function ? c(n) : c;
    w !== void 0 && this.setMyAwareness(w), this._data = g, this.__data = g, this.reinitializeElementData(t), d && d(this.getSetupData());
  }
  reinitializeElementData({
    element: t,
    onChange: n,
    onAwarenessChange: s,
    updateElement: r,
    updateElementAwareness: i,
    onClick: o,
    onDrag: c,
    onDragStart: l,
    resetShortcut: a,
    debounceMs: h,
    triggerAwarenessUpdate: u
  }) {
    this.triggerAwarenessUpdate = u, this.onChange = n, this.debouncedOnChange = Fi(this.onChange, h), this.onAwarenessChange = s, this.updateElement = r, this.updateElementAwareness = i, o && !this.onClick && t.addEventListener("click", (d) => {
      this.onClick?.(d, this.getEventHandlerData());
    }), this.onClick = o, c && !this.onDrag && (t.addEventListener("touchstart", (d) => {
      d.preventDefault(), t.classList.add("cursordown"), this.onDragStart?.(d, this.getEventHandlerData());
      const f = (g) => {
        g.preventDefault(), this.onDrag?.(g, this.getEventHandlerData());
      }, p = (g) => {
        t.classList.remove("cursordown"), document.removeEventListener("touchmove", f), document.removeEventListener("touchend", p);
      };
      document.addEventListener("touchmove", f), document.addEventListener("touchend", p);
    }), t.addEventListener("mousedown", (d) => {
      d.preventDefault(), this.onDragStart?.(d, this.getEventHandlerData()), t.classList.add("cursordown");
      const f = (g) => {
        g.preventDefault(), this.onDrag?.(g, this.getEventHandlerData());
      }, p = (g) => {
        t.classList.remove("cursordown"), document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", p);
      };
      document.addEventListener("mousemove", f), document.addEventListener("mouseup", p);
    })), this.onDrag = c, this.onDragStart = l, a && !this.resetShortcut && (t.reset = this.reset, t.addEventListener("click", (d) => {
      switch (this.resetShortcut) {
        case "ctrlKey":
          if (!d.ctrlKey)
            return;
          break;
        case "altKey":
          if (!d.altKey)
            return;
          break;
        case "shiftKey":
          if (!d.shiftKey)
            return;
          break;
        case "metaKey":
          if (!d.metaKey)
            return;
          break;
        default:
          return;
      }
      this.reset(), d.preventDefault(), d.stopPropagation();
    })), this.resetShortcut = a;
  }
  get data() {
    return this._data;
  }
  setLocalData(t) {
    this.localData = t;
  }
  /**
   * // PRIVATE USE ONLY \\
   *
   * Updates the internal state with the given data and handles all the downstream effects. Should only be used by the sync code to ensure one-way
   * reactivity.
   * (e.g. calling `updateElement` and `onChange`)
   */
  set __data(t) {
    this._data = t, this.updateElement(this.getEventHandlerData());
  }
  updateAwareness(t, n) {
    this.updateElementAwareness && (this.awareness = t, this.awarenessByStableId = n, this.updateElementAwareness(this.getAwarenessEventHandlerData()));
  }
  getEventHandlerData() {
    return {
      element: this.element,
      data: this.data,
      localData: this.localData,
      awareness: this.awareness,
      awarenessByStableId: this.awarenessByStableId,
      setData: (t) => this.setData(t),
      setLocalData: (t) => this.setLocalData(t),
      setMyAwareness: (t) => this.setMyAwareness(t)
    };
  }
  getAwarenessEventHandlerData() {
    return {
      ...this.getEventHandlerData(),
      myAwareness: this.selfAwareness
    };
  }
  getSetupData() {
    return {
      getElement: () => this.element,
      getData: () => this.data,
      getLocalData: () => this.localData,
      getAwareness: () => this.awareness,
      setData: (t) => this.setData(t),
      setLocalData: (t) => this.setLocalData(t),
      setMyAwareness: (t) => this.setMyAwareness(t)
    };
  }
  /**
   * Public setter for element data.
   *
   * Semantics:
   * - Mutator form: setData((draft) => { ... })
   *   When data is backed by SyncedStore/Yjs (dataMode = "syncedstore"),
   *   the draft is a live CRDT proxy. You can mutate nested arrays/objects
   *   and the change will be merged across clients without conflicts.
   *   Example:
   *     setData(d => { d.list.push(item); });
   *
   * - Value form: setData(value)
   *   Replaces the entire data snapshot. Use this when you need canonical
   *   replacement semantics (e.g., snapshot from a mirror) or when running
   *   in legacy plain mode. Example:
   *     setData({ on: true });
   *
   * Notes:
   * - In plain mode, only the value form results in a sync; mutating draft
   *   is a no-op. Prefer the mutator form for merge-friendly edits.
   * - Directly mutating eventData.data may work in SyncedStore mode, but the
   *   recommended portable pattern is setData(draft => { ... }).
   */
  setData(t) {
    this.onChange(t);
  }
  // TODO: this should be keyed on the element to avoid conflicts
  setMyAwareness(t) {
    t !== this.selfAwareness && (this.selfAwareness = t, this.onAwarenessChange(t), this.triggerAwarenessUpdate?.());
  }
  setDataDebounced(t) {
    this.debouncedOnChange(t);
  }
  /**
   * Resets the element to its default state.
   */
  reset() {
    this.setData(this.defaultData);
  }
}
async function Ud(e, t) {
  const n = new TextEncoder().encode(`${e}-${t.outerHTML}}`), s = await crypto.subtle.digest("SHA-1", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
function $t(e, t) {
  return e.__playhtml_cursors__?.playerIdentity?.publicKey ?? String(t);
}
function Pd(e) {
  const t = [], n = Array.from(e.keys()).sort((s, r) => s - r);
  for (const s of n) {
    const r = e.get(s);
    if (!r) continue;
    const i = Object.keys(r).filter((o) => !o.startsWith("__")).sort();
    for (const o of i) {
      const c = r[o];
      if (c == null || typeof c != "object") continue;
      const l = c, a = Object.keys(l).sort();
      for (const h of a)
        try {
          t.push(
            `${s}:${o}:${h}:${JSON.stringify(l[h])}`
          );
        } catch {
        }
    }
  }
  return t.join("|");
}
class Bd {
  cellSize;
  grid = /* @__PURE__ */ new Map();
  constructor(t = 200) {
    this.cellSize = t;
  }
  getCellKey(t, n) {
    const s = Math.floor(t / this.cellSize), r = Math.floor(n / this.cellSize);
    return `${s},${r}`;
  }
  getNearbyCellKeys(t, n, s) {
    const r = [], i = Math.ceil(s / this.cellSize), o = Math.floor(t / this.cellSize), c = Math.floor(n / this.cellSize);
    for (let l = -i; l <= i; l++)
      for (let a = -i; a <= i; a++)
        r.push(`${o + l},${c + a}`);
    return r;
  }
  insert(t) {
    const n = this.getCellKey(t.x, t.y);
    this.grid.has(n) || this.grid.set(n, /* @__PURE__ */ new Map()), this.grid.get(n).set(t.id, t);
  }
  remove(t, n, s) {
    if (n !== void 0 && s !== void 0) {
      const r = this.getCellKey(n, s), i = this.grid.get(r);
      if (i && i.has(t))
        return i.delete(t), i.size === 0 && this.grid.delete(r), !0;
    } else
      for (const [r, i] of this.grid)
        if (i.has(t))
          return i.delete(t), i.size === 0 && this.grid.delete(r), !0;
    return !1;
  }
  update(t, n, s) {
    n !== void 0 && s !== void 0 ? this.remove(t.id, n, s) : this.remove(t.id), this.insert(t);
  }
  findNearby(t, n, s, r) {
    const i = [], o = this.getNearbyCellKeys(t, n, s), c = s * s;
    for (const l of o) {
      const a = this.grid.get(l);
      if (a)
        for (const h of a.values()) {
          if (r && h.id === r) continue;
          const u = h.x - t, d = h.y - n;
          u * u + d * d <= c && i.push(h);
        }
    }
    return i;
  }
  getAll() {
    const t = [];
    for (const n of this.grid.values())
      t.push(...n.values());
    return t;
  }
  clear() {
    this.grid.clear();
  }
  // Debug info
  getCellCount() {
    return this.grid.size;
  }
  getItemCount() {
    let t = 0;
    for (const n of this.grid.values())
      t += n.size;
    return t;
  }
}
class jd {
  listening = !1;
  message = "";
  chatElement = null;
  timeout = null;
  options;
  constructor(t = {}) {
    this.options = t, this.initialize();
  }
  initialize() {
    this.setupKeyboardHandlers(), this.createChatElement();
  }
  setupKeyboardHandlers() {
    const t = (n) => {
      if (this.timeout && clearTimeout(this.timeout), this.timeout = setTimeout(() => {
        this.setListening(!1), this.setMessage("");
      }, 1e4), !this.listening)
        n.key === "/" && (this.setMessage(""), this.setListening(!0), n.preventDefault(), n.stopPropagation());
      else if (!n.metaKey && !n.ctrlKey && !n.altKey) {
        if (n.key === "Enter")
          this.setListening(!1);
        else if (n.key === "Escape")
          this.setListening(!1), this.setMessage("");
        else if (n.key === "Backspace")
          this.setMessage(this.message.slice(0, -1));
        else if (n.key.length === 1) {
          const s = this.message.length < 42 ? this.message + n.key : this.message;
          this.setMessage(s);
        }
        return n.preventDefault(), n.stopPropagation(), !1;
      }
    };
    document.addEventListener("keydown", t);
  }
  setListening(t) {
    this.listening = t, this.updateChatDisplay();
  }
  setMessage(t) {
    this.message = t, this.updateChatDisplay(), this.options.onMessageUpdate?.(t.length > 0 ? t : null);
  }
  createChatElement() {
    if (this.chatElement) return;
    const t = document.createElement("style");
    t.textContent = `
      .playhtml-chat-container {
        box-sizing: border-box;
        position: fixed;
        bottom: 24px;
        right: 32px;
        padding: 8px;
        height: 48px;
        border-radius: 24px;
        min-width: 4.4em;
        background-color: rgba(52, 199, 89, 1);
        color: white;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 8px;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 320;
        z-index: 1000000;
      }
      
      .playhtml-chat-input {
        box-sizing: border-box;
        padding: 0px 4px 0px 4px;
        margin: 0px;
        font-size: 24px;
        line-height: 1;
        white-space: nowrap;
        background: transparent;
        border: none;
        outline: none;
        color: white;
      }
      
      .playhtml-chat-button {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 250;
        padding: 0px;
        margin: 0px;
        border: 0.5px solid rgba(255,255,255,0.75);
        cursor: pointer;
        color: white;
        background-color: transparent;
      }
    `, document.head.appendChild(t), this.chatElement = document.createElement("div"), this.chatElement.className = "playhtml-chat-container", this.chatElement.style.display = "none", document.body.appendChild(this.chatElement);
  }
  updateChatDisplay() {
    this.chatElement && (this.listening || this.message ? (this.chatElement.innerHTML = `
        <div class="playhtml-chat-input">${this.message || "..."}</div>
        <div class="playhtml-chat-button">&times;</div>
      `, this.chatElement.style.display = "flex", this.chatElement.querySelector(
      ".playhtml-chat-button"
    )?.addEventListener("click", () => {
      this.setListening(!1), this.setMessage("");
    })) : this.chatElement.style.display = "none");
  }
  showCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.innerHTML = '<div class="playhtml-chat-input">Type / to reply</div>', this.chatElement.style.display = "flex");
  }
  hideCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.style.display = "none");
  }
  getCurrentMessage() {
    return this.message.length > 0 ? this.message : null;
  }
  destroy() {
    this.timeout && clearTimeout(this.timeout), this.chatElement && (this.chatElement.remove(), this.chatElement = null);
  }
}
const ke = "__playhtml_cursors__";
function it(e) {
  const t = e.playerStyle?.colorPalette?.[0];
  if (t == null || t === "")
    throw new Error(
      "[playhtml] Player identity must have playerStyle.colorPalette[0] (primary color)."
    );
  return t;
}
function Hi(e) {
  if (!e.publicKey)
    throw new Error("[playhtml] Player identity must have publicKey.");
  it(e);
}
function Ee(e, t) {
  const n = e?.[ke];
  if (!n?.cursor || !n.playerIdentity?.publicKey)
    return null;
  try {
    it(n.playerIdentity);
  } catch {
    return null;
  }
  return n;
}
function Ss(e, t) {
  return Math.sqrt(
    Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)
  );
}
function Rc() {
  return window.visualViewport?.scale ?? 1;
}
function Vi(e, t, n) {
  const s = Rc();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, l = r?.offsetTop ?? 0;
    return {
      x: (e + c) / (i * s) * 100,
      y: (t + l) / (o * s) * 100
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, l = r?.offsetTop ?? 0;
    return {
      x: (e + c) / s + i,
      y: (t + l) / s + o
    };
  }
}
function bt(e, t, n) {
  const s = Rc();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, l = r?.offsetTop ?? 0;
    return {
      x: e / 100 * i * s - c,
      y: t / 100 * o * s - l
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, l = r?.offsetTop ?? 0;
    return {
      x: (e - i) * s - c,
      y: (t - o) * s - l
    };
  }
}
class zd {
  position;
  velocity;
  target;
  stiffness;
  damping;
  mass;
  animationFrame = null;
  onUpdate;
  constructor(t, n, s = {}) {
    this.position = { ...t }, this.velocity = { x: 0, y: 0 }, this.target = { ...t }, this.onUpdate = n, this.stiffness = s.stiffness ?? 170, this.damping = s.damping ?? 26, this.mass = s.mass ?? 0.5;
  }
  setTarget(t) {
    this.target = { ...t }, this.animationFrame === null && this.animate();
  }
  animate = () => {
    const t = 0.016666666666666666, n = (this.target.x - this.position.x) * this.stiffness, s = (this.target.y - this.position.y) * this.stiffness, r = this.velocity.x * this.damping, i = this.velocity.y * this.damping, o = (n - r) / this.mass, c = (s - i) / this.mass;
    this.velocity.x += o * t, this.velocity.y += c * t, this.position.x += this.velocity.x * t, this.position.y += this.velocity.y * t, this.onUpdate(this.position);
    const l = Math.sqrt(
      Math.pow(this.target.x - this.position.x, 2) + Math.pow(this.target.y - this.position.y, 2)
    ), a = Math.sqrt(
      Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
    );
    l < 0.5 && a < 0.5 ? (this.position = { ...this.target }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position), this.animationFrame = null) : this.animationFrame = requestAnimationFrame(this.animate);
  };
  // Immediately jump to a position without spring animation.
  // Used when the viewport changes (scroll/zoom) and cursors need to
  // track content instantly.
  snapTo(t) {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.position = { ...t }, this.target = { ...t }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position);
  }
  destroy() {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null);
  }
}
function Nc(e) {
  e = e.replace(/"/g, "'"), e = e.replace(/>\s{1,}</g, "><"), e = e.replace(/\s{2,}/g, " ");
  const t = /[\r\n%#()<>?[\\\]^`{|}]/g;
  return e.replace(t, encodeURIComponent);
}
function Uc(e) {
  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 9 18 18"
    width="18"
    height="18"
    fill="none"
    fillRule="evenodd"
  >
    <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="white">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="${e}">
      <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
      <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
    </g>
  </svg>`;
}
function gn(e) {
  return `url("data:image/svg+xml,${Nc(Uc(e))}"), auto`;
}
function Fd(e) {
  if (!e.startsWith('url("'))
    return;
  const t = e.indexOf('")', 5);
  if (t !== -1)
    return e.slice(5, t);
}
class Hd {
  constructor(t, n = {}) {
    this.provider = t, this.options = n, this.playerIdentity = n.playerIdentity || Pn(), Hi(this.playerIdentity), this.visibilityThreshold = n.visibilityThreshold || void 0, this.coordinateMode = n.coordinateMode || "absolute", this.options.enableChat === !0 && (this.chat = new jd({
      onMessageUpdate: (s) => {
        this.currentMessage = s, this.updateCursorAwareness();
      }
    })), this.initialize(), this.setupGlobalAPI();
  }
  cursors = /* @__PURE__ */ new Map();
  cursorAnimators = /* @__PURE__ */ new Map();
  // Spring animators for each cursor
  spatialGrid = new Bd(300);
  // 300px cell size
  proximityUsers = /* @__PURE__ */ new Set();
  currentCursor = null;
  playerIdentity;
  updateThrottled = !1;
  lastUpdate = 0;
  visibilityThreshold;
  isStylesAdded = !1;
  globalApiListeners = /* @__PURE__ */ new Map();
  activeAnimationCleanups = /* @__PURE__ */ new Map();
  // stableId -> cleanup fn
  allPlayerColors = /* @__PURE__ */ new Set();
  chat = null;
  currentMessage = null;
  otherUsersWithMessages = /* @__PURE__ */ new Set();
  cursorPresenceChangeCallbacks = /* @__PURE__ */ new Map();
  coordinateMode;
  zones = /* @__PURE__ */ new Map();
  currentZone = null;
  cursorZoneState = /* @__PURE__ */ new Map();
  // stableId -> previous zoneId
  // Maps Yjs clientId -> stableId (publicKey). Multiple clientIds can map to
  // the same stableId when a user has multiple tabs open. Used to:
  // (a) skip rendering our own cursor from other tabs
  // (b) collapse multiple tabs from the same remote user into one cursor
  // (c) clean up cursor elements correctly when a clientId disconnects
  clientIdToStableId = /* @__PURE__ */ new Map();
  // Tracks pending fade-out removal timeouts by stableId so they can be
  // cancelled if a new update arrives for the same stableId (e.g. when one
  // tab disconnects but another tab of the same user is still active).
  pendingRemovals = /* @__PURE__ */ new Map();
  initialize() {
    this.addCursorStyles(), this.setupCursorTracking(), this.setupAwarenessHandling(), document.documentElement.style.cursor = gn(
      it(this.playerIdentity)
    );
  }
  setupAwarenessHandling() {
    this.provider.awareness.on("change", ({ added: t, updated: n, removed: s }) => {
      this.handleAwarenessChange(t, n, s);
    }), this.updateCursorAwareness(), this.syncExistingAwareness();
  }
  syncExistingAwareness() {
    const t = this.provider.awareness.getStates(), n = Array.from(t.keys());
    this.handleAwarenessChange(n, [], []);
  }
  handleAwarenessChange(t, n, s) {
    const r = this.provider.awareness.getStates(), i = this.provider.awareness.clientID, o = this.playerIdentity.publicKey;
    [...t, ...n].forEach((c) => {
      const l = r.get(c);
      let a = l ? $t(l, c) : String(c);
      if (a === String(c) && (a = this.clientIdToStableId.get(c) ?? a), this.clientIdToStableId.set(c, a), c === i || a === o)
        return;
      const h = Ee(l);
      h ? this.updateCursor(a, h) : this.hasOtherClientForStableId(a, c) || this.removeCursor(a), l?.[ke]?.message ? this.otherUsersWithMessages.add(a) : this.otherUsersWithMessages.delete(a);
    }), s.forEach((c) => {
      const l = this.clientIdToStableId.get(c);
      this.clientIdToStableId.delete(c), l && (this.otherUsersWithMessages.delete(l), this.hasOtherClientForStableId(l, c) || this.removeCursor(l));
    }), this.rebuildSpatialGrid(), this.allPlayerColors.clear(), r.forEach((c, l) => {
      const a = Ee(
        c
      );
      a && this.allPlayerColors.add(it(a.playerIdentity));
    }), this.updateGlobalColors(), this.updateChatCTA(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
  }
  // Returns true if any clientId other than the excluded one maps to the given stableId.
  hasOtherClientForStableId(t, n) {
    for (const [s, r] of this.clientIdToStableId)
      if (r === t && s !== n) return !0;
    return !1;
  }
  rebuildSpatialGrid() {
    this.spatialGrid.clear();
    const t = this.provider.awareness.getStates(), n = this.provider.awareness.clientID, s = this.playerIdentity.publicKey;
    t.forEach((r, i) => {
      if (i === n) return;
      const o = $t(
        r,
        i
      );
      if (o === s) return;
      const c = Ee(
        r
      );
      if (!c) return;
      const l = bt(
        c.cursor.x,
        c.cursor.y,
        this.coordinateMode
      );
      this.spatialGrid.insert({
        id: o,
        x: l.x,
        y: l.y,
        data: c
      });
    });
  }
  checkProximityOptimized() {
    if (!this.currentCursor) return;
    const t = /* @__PURE__ */ new Set(), n = this.options.proximityThreshold || qu, s = bt(
      this.currentCursor.x,
      this.currentCursor.y,
      this.coordinateMode
    ), r = this.spatialGrid.findNearby(
      s.x,
      s.y,
      n
    );
    for (const i of r) {
      const o = i.data;
      if (!o.cursor) continue;
      const c = bt(
        o.cursor.x,
        o.cursor.y,
        this.coordinateMode
      );
      if (Ss(
        {
          x: s.x,
          y: s.y,
          pointer: this.currentCursor.pointer
        },
        {
          x: c.x,
          y: c.y,
          pointer: o.cursor.pointer
        }
      ) < n && (t.add(i.id), !this.proximityUsers.has(i.id))) {
        const h = {
          ours: { x: this.currentCursor.x, y: this.currentCursor.y },
          theirs: { x: o.cursor.x, y: o.cursor.y }
        }, u = o.cursor.x - this.currentCursor.x, d = o.cursor.y - this.currentCursor.y, f = Math.atan2(d, u);
        this.options.onProximityEntered?.(
          o.playerIdentity,
          h,
          f
        );
      }
    }
    for (const i of this.proximityUsers)
      t.has(i) || this.options.onProximityLeft?.(i);
    this.proximityUsers = t;
  }
  addCursorStyles() {
    if (this.isStylesAdded || document.getElementById("playhtml-cursor-styles"))
      return;
    const t = document.createElement("style");
    t.id = "playhtml-cursor-styles", t.textContent = `
      .playhtml-cursor-other {
        position: fixed;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 999999;
        transition: all 0.1s ease;
        transform-origin: center;
      }
      
      .playhtml-cursor-fade-in {
        animation: cursorFadeIn 0.3s ease-out;
      }
      
      .playhtml-cursor-fade-out {
        animation: cursorFadeOut 0.3s ease-out;
        opacity: 0;
      }
      
      @keyframes cursorFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes cursorFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
    `, document.head.appendChild(t), this.isStylesAdded = !0;
  }
  // Build the onUpdate callback for a SpringAnimator. Position values are
  // always in pixel space — zone-relative coordinates are resolved to pixels
  // before being fed to the spring.
  createCursorPositionCallback(t) {
    return (n) => {
      const s = this.cursors.get(t);
      s && (s.style.position = this.coordinateMode === "absolute" ? "absolute" : "fixed", s.style.left = `${n.x}px`, s.style.top = `${n.y}px`, s.style.zIndex = "999999", s.style.pointerEvents = "none");
    };
  }
  // Resolves storage coordinates to the coordinate space used for positioning.
  // In absolute mode, storage coords are already document coords and cursors
  // use position:absolute, so no conversion needed. In relative mode, we
  // convert to viewport pixels for position:fixed.
  resolveTargetCoords(t, n) {
    return this.coordinateMode === "absolute" ? { x: t, y: n } : bt(t, n, this.coordinateMode);
  }
  // Apply zone-specific cursor styling, or revert to global styling when leaving a zone.
  applyZoneStyling(t, n, s) {
    if (t.style.cssText = t.style.cssText, s) {
      const r = this.zones.get(s);
      if (r?.options?.getCursorStyle) {
        const i = r.options.getCursorStyle(n);
        Object.assign(t.style, i);
        return;
      }
    }
    if (this.options.getCursorStyle) {
      const r = this.options.getCursorStyle(n);
      Object.assign(t.style, r);
    }
  }
  hitTestZones(t, n) {
    let s = null, r = 1 / 0;
    for (const [i, { element: o }] of this.zones) {
      if (!document.contains(o)) continue;
      const c = o.getBoundingClientRect();
      if (t >= c.left && t <= c.right && n >= c.top && n <= c.bottom) {
        const l = c.width * c.height;
        l < r && (r = l, s = {
          zoneId: i,
          relX: Math.max(0, Math.min(1, (t - c.left) / c.width)),
          relY: Math.max(0, Math.min(1, (n - c.top) / c.height))
        });
      }
    }
    return s;
  }
  setupCursorTracking() {
    const t = (o) => {
      let c = "mouse";
      const l = document.elementFromPoint(o.clientX, o.clientY);
      if (l) {
        const h = window.getComputedStyle(l), u = Fd(h.cursor);
        if (u) {
          const d = Nc(
            Uc(it(this.playerIdentity))
          );
          u.includes(d) || (c = u);
        }
      }
      c === "mouse" ? document.documentElement.style.cursor = gn(
        it(this.playerIdentity)
      ) : document.documentElement.style.cursor = "auto";
      const a = Vi(
        o.clientX,
        o.clientY,
        this.coordinateMode
      );
      this.currentCursor = {
        x: a.x,
        y: a.y,
        pointer: c
      }, this.currentZone = this.hitTestZones(o.clientX, o.clientY), this.throttledUpdateCursorAwareness(), this.updateAllCursorVisibility();
    }, n = (o) => {
      const c = o.touches[0];
      if (c) {
        const l = Vi(
          c.clientX,
          c.clientY,
          this.coordinateMode
        );
        this.currentCursor = {
          x: l.x,
          y: l.y,
          pointer: "touch"
        }, this.currentZone = this.hitTestZones(c.clientX, c.clientY), this.throttledUpdateCursorAwareness(), this.updateAllCursorVisibility();
      }
    }, s = () => {
    };
    document.addEventListener("mousemove", t), document.addEventListener("touchmove", n), document.addEventListener("touchend", s), document.addEventListener("mouseleave", () => {
      this.showAllCursors();
    });
    let r = null;
    const i = () => {
      r === null && (r = requestAnimationFrame(() => {
        r = null, this.repositionAllCursors();
      }));
    };
    window.addEventListener("scroll", i, {
      passive: !0
    }), window.addEventListener("resize", i), window.visualViewport && (window.visualViewport.addEventListener(
      "scroll",
      i
    ), window.visualViewport.addEventListener(
      "resize",
      i
    )), window.addEventListener("beforeunload", () => {
      this.provider.awareness.setLocalStateField(ke, null);
    });
  }
  // Re-derive positions for all remote cursors. In relative mode, this is
  // needed on every scroll/resize since cursors use position:fixed with
  // viewport-relative coords. In absolute mode, non-zone cursors use
  // position:absolute and the browser handles scroll — only zone cursors
  // need re-resolution (getBoundingClientRect changes on scroll).
  repositionAllCursors() {
    const t = this.provider.awareness.getStates(), n = this.provider.awareness.clientID, s = this.playerIdentity.publicKey;
    for (const [r, i] of t) {
      const o = $t(
        i,
        r
      );
      if (r === n || o === s) continue;
      const c = Ee(
        i
      );
      if (!c?.cursor) continue;
      const l = this.cursorAnimators.get(o);
      if (!l) continue;
      if (c.zone) {
        const h = this.zones.get(c.zone.zoneId);
        if (h && document.contains(h.element)) {
          const u = h.element.getBoundingClientRect(), d = this.cursors.get(o), f = d ? d.offsetWidth / 2 : 0, p = d ? d.offsetHeight / 2 : 0, g = u.left + c.zone.relX * u.width - f, w = u.top + c.zone.relY * u.height - p;
          this.coordinateMode === "absolute" ? l.snapTo({
            x: g + window.scrollX,
            y: w + window.scrollY
          }) : l.snapTo({ x: g, y: w });
          continue;
        }
      }
      if (this.coordinateMode === "absolute") continue;
      const a = bt(
        c.cursor.x,
        c.cursor.y,
        this.coordinateMode
      );
      l.snapTo({ x: a.x, y: a.y });
    }
    this.updateAllCursorVisibility();
  }
  throttledUpdateCursorAwareness() {
    if (this.updateThrottled) return;
    this.updateThrottled = !0;
    const t = performance.now(), n = t - this.lastUpdate, s = 1e3 / 60;
    n >= s ? (this.updateCursorAwareness(), this.lastUpdate = t, this.updateThrottled = !1) : setTimeout(() => {
      this.updateCursorAwareness(), this.lastUpdate = performance.now(), this.updateThrottled = !1;
    }, s - n);
  }
  updateCursorAwareness() {
    const t = {
      cursor: this.currentCursor,
      playerIdentity: this.playerIdentity,
      lastSeen: Date.now(),
      message: this.currentMessage,
      page: window.location.pathname,
      zone: this.currentZone
    };
    this.provider.awareness.setLocalStateField(
      ke,
      t
    );
  }
  updateCursor(t, n) {
    const s = this.pendingRemovals.get(t);
    if (s) {
      clearTimeout(s), this.pendingRemovals.delete(t);
      const x = this.cursors.get(t);
      x && (x.classList.remove("playhtml-cursor-fade-out"), x.classList.add("playhtml-cursor-fade-in"));
    }
    const r = n.playerIdentity;
    if (this.options.shouldRenderCursor && !this.options.shouldRenderCursor(n)) {
      this.removeCursor(t);
      return;
    }
    let i = this.cursors.get(t);
    const o = n.cursor, c = i && i.dataset.pointerType !== o.pointer;
    !i || c ? (i && i.remove(), i = this.createCursorElement(
      r,
      o.pointer,
      n.message,
      t,
      n
    ), i.dataset.pointerType = o.pointer, this.cursors.set(t, i), document.body.appendChild(i)) : i && (this.updateCursorMessage(i, r, n.message), this.updateCursorName(i, r));
    const l = n.zone, a = this.cursorZoneState.get(t) ?? null, h = l?.zoneId ?? null, u = a !== h;
    this.cursorZoneState.set(t, h);
    let d, f = !1;
    if (l) {
      const x = this.zones.get(l.zoneId);
      if (x && document.contains(x.element)) {
        const E = x.element.getBoundingClientRect(), I = this.cursors.get(t), G = I ? I.offsetWidth / 2 : 0, Nt = I ? I.offsetHeight / 2 : 0, rt = E.left + l.relX * E.width - G, nn = E.top + l.relY * E.height - Nt;
        this.coordinateMode === "absolute" ? d = {
          x: rt + window.scrollX,
          y: nn + window.scrollY
        } : d = { x: rt, y: nn }, f = !0;
      } else
        d = this.resolveTargetCoords(o.x, o.y);
    } else
      d = this.resolveTargetCoords(o.x, o.y);
    u && this.applyZoneStyling(i, n, f ? h : null);
    let p = d.x, g = d.y;
    if (this.coordinateMode === "relative") {
      const E = window.innerWidth, I = window.innerHeight;
      p = Math.max(
        -18,
        Math.min(E - 2, d.x)
      ), g = Math.max(
        -18,
        Math.min(I - 2, d.y)
      );
    }
    let w = this.cursorAnimators.get(t);
    if (w || (w = new zd(
      { x: p, y: g },
      this.createCursorPositionCallback(t)
    ), this.cursorAnimators.set(t, w)), u ? w.snapTo({ x: p, y: g }) : w.setTarget({ x: p, y: g }), this.currentCursor) {
      const x = bt(
        this.currentCursor.x,
        this.currentCursor.y,
        this.coordinateMode
      ), E = Ss(
        { x: d.x, y: d.y, pointer: o.pointer },
        {
          x: x.x,
          y: x.y,
          pointer: this.currentCursor.pointer
        }
      ), I = this.visibilityThreshold ? E < this.visibilityThreshold : !0;
      i.style.display = I ? "block" : "none", i.style.opacity = I ? "1" : "0", i.dataset.animating || (i.style.transform = I ? "scale(1)" : "scale(0.8)");
    } else
      i.style.display = "block", i.style.opacity = "1", i.dataset.animating || (i.style.transform = "scale(1)");
  }
  createCursorElement(t, n = "mouse", s, r, i) {
    const o = document.createElement("div");
    if (o.className = "playhtml-cursor-other playhtml-cursor-fade-in", r && this.options.onCustomCursorRender) {
      const l = this.options.onCustomCursorRender(
        r,
        o
      );
      if (l)
        return l;
    }
    const c = it(t);
    switch (n) {
      case "mouse":
        o.innerHTML = this.getMouseCursorSVG(c);
        break;
      case "touch":
        o.innerHTML = this.getTouchCursorSVG(c);
        break;
      default:
        o.innerHTML = this.getCustomCursorSVG(c, n);
        break;
    }
    if (this.options.cursorStyle && (o.style.cssText += this.options.cursorStyle), this.updateCursorMessage(o, t, s), this.updateCursorName(o, t), this.options.getCursorStyle && i) {
      const l = this.options.getCursorStyle(i);
      Object.assign(o.style, l);
    }
    return o;
  }
  getMouseCursorSVG(t) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(10 7)">
          <path
            d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
            fill="#fff"
          />
          <path
            d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
            fill="${t}"
          />
        </g>
      </svg>
    `;
  }
  getTouchCursorSVG(t) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <path
            d="m3.8852309 13.5522788c.15029277.1354048.25406355.2326609.57471053.5372549.31406586.2983172.46594413.439273.60482646.5572091.05791893.0487853.10729946.1792495.12686364.3731628.01609788.1595565.01049553.3375341-.0090192.5090254-.00674888.0593077-.01325791.1020883-.01698742.1224696-.04186639.2287942.13249226.4401222.36507344.4424801.20929712.0021219.37056581.00472.79741331.0123273.10679864.0019014.10679864.0019014.21395196.0037648 1.16029156.0199598 1.75290683.01448 2.1782236-.039003.45462139-.05716.92282087-.6061887 1.32754658-1.2951218.3429437.6096032.818651 1.2048784 1.2990136 1.282277.1525992.0243739.3372104.0319365.5511764.0270146.1595258-.0036697.328349-.0141847.4987188-.0294071.1284742-.0114791.2308379-.0230173.2919821-.0309462.2259121-.0292954.3737346-.2515956.31337-.4712558-.0130388-.0474468-.0339905-.1345046-.0551176-.2441066-.0244927-.1270617-.0421932-.2511642-.0502379-.3642189-.0051002-.0716765-.0061057-.1365707-.0028638-.1926702.0056365-.097781.007395-.1525378.0101327-.2790463.0010457-.0470941.0010457-.0470941.0024433-.0883088.0052898-.134881.0234093-.2629524.0820463-.5422232.0251901-.1212103.1472903-.3531692.3395862-.6402332.0572734-.0854992.1198813-.1747825.1869659-.2669588.127207-.1747861.2641214-.3514011.4010853-.5204043.0820457-.1012383.1454717-.1769623.1807968-.2180763.2962199-.424403.6120842-1.1191696.7281396-1.5253635.111416-.3904017.2005405-1.10937558.2553074-1.81604479.0300143-.40088807.0411211-.72405394.0411211-1.23097561.0000507-.08891816.0000507-.08891816.0002032-.16234685.0002858-.12025251.0003032-.16573976-.0000887-.22195195-.0010706-.15358041-.0055478-.30580145-.0203882-.6940256-.0319191-.81365149-.4778003-1.3396911-1.1348711-1.44115781-.5589865-.08632026-1.2393839.37795756-1.2393839.37795756s-.1514404-.5228127-.2537197-.6842075c-.1661957-.25934741-.5941748-.58982828-.9213451-.65421118-.3365014-.0653413-.7354024-.05811592-1.1017193.00667481-.3207944.05740454-.64034865.34382687-.82518751.65277182-.13223727.22039488-.00786932-.01169164-.14013104-.2396787-.1830552-.31402315-.60932935-.59522407-1.01524567-.67822294-.34396352-.07112559-.73801897-.04403625-1.09795562.06293793-.46304125.13836397-.53675291.49073282-.55516748.38984626-.06158674-.3382385-.06727482-.3160095-.105656-.55729603-.14258072-.89527436-.30213161-1.51473549-.54406219-2.05528331.01391678.0310773-.08860981-.20214701-.12592279-.28256779-.06461002-.13925416-.12910532-.2652956-.19999629-.38652204-.21850342-.37364978-.46891278-.65340904-.7830908-.81233894-.54561037-.27629378-1.3634177-.14183064-1.75105565.31064856-.38495968.44966797-.4491432 1.20149287-.3521966 2.13184003.03702376.36121263.16678627 1.02066144.28444961 1.50812387.04160602.1691894.07805979.32348903.14491578.60851331.01149723.04848415.01149723.04848415.02309483.09698036.05172236.21571896.09707607.39320067.15122332.5879629-.00568154-.02030261.09701461.344086.11888835.42472961.00727686.02691587.00727686.02691587.01448296.05395339.04082856.15377935.08074083.31959314.14309954.5963099.03412572.1521447.06742545.31468601.09999775.48699018.08883553.46993091.089274.37207374.00375852.27186198-.05907319-.06922522-.11463055-.13209255-.16830659-.19003644-.09976937-.10770214-.19148509-.19677225-.2785569-.2678141-.6343975-.51905295-1.02312991-.74839425-1.55681885-.79878106-.87541567-.08410158-1.70619803.53426712-1.83111632 1.36882761-.07682697.51169638-.05207639.74723271.18463583 1.19942735.13026223.24432805.35060714.53942202.76172732 1.04735429.02515953.031068.02515953.031068.05030428.06206416.50464537.62186746.55962098.69095396.67961467.86473786.32435479.4706845 1.1139501 1.8221455 1.25748612 2.0035872z"
            fill="${t}"
          />
          <path
            d="m1.68266944 9.2716401c-.02488625-.03067752-.02488625-.03067752-.04970567-.06132555-.37729166-.46613768-.58418002-.74321015-.68156241-.9258495-.15281729-.29195235-.1611316-.37107459-.10605794-.73788601.06473349-.43247455.53181583-.78013371 1.01829549-.73339767.33660502.03178017.63068475.20527903 1.15339692.63295262.0565942.04617564.12482853.1124417.20288232.19670163.04616569.04983637.09513192.10524534.14800114.16720042.0794093.0930562.34702847.42052231.30761424.37286894.05814283.06991619.09971852.12407704.14721655.19045018.0941062.13434104.14705111.20894642.21874992.30454484-.0336171-.04487143.21473082.29843305.26732159.34863333.27859812.26593456.68203289.04195871.65675979-.31244785-.00421914-.05916537-.01812774-.12308431-.04717934-.23466885-.11487425-.81923739-.15505751-1.08218312-.24678252-1.56739907-.03407352-.18024544-.06905328-.35098727-.10521102-.5121905-.06435409-.28557213-.10635725-.46007245-.14994794-.62425526-.00774801-.02907063-.00774801-.02907063-.01552357-.05783095-.02300644-.08481964-.12725123-.45470311-.12030828-.42989063-.05134381-.18468043-.0945453-.35373996-.14431997-.56133562-.01130896-.04728909-.01130896-.04728909-.02259904-.09489949-.06649254-.28350912-.10387999-.44176072-.14606063-.6132721-.10998732-.45567652-.23425389-1.08719519-.2671036-1.40768017-.07546665-.72422018-.02339381-1.33418457.17582284-1.56688778.15554834-.1815673.59641015-.25405339.84271752-.12932486.16107512.0814814.32204278.26131571.47435101.521769.05764302.09857191.11172763.20426801.16708381.32357735.0335256.07225783.13292567.29837003.12172905.27336705.21032209.46992469.354801 1.03086841.48791736 1.86671535.03939531.24766201.08813662.52823537.15063928.87150416.01857903.10178746.01857903.10178746.03722922.20314381.30139226 1.63533599.27933797 1.51139381.28367122 1.64182468.01580667.47578071.71810567.4869267.74900255.01188722.00979855-.15065269.00630989-.2851661-.01107827-.67146517-.00245496-.05465243-.00245496-.05465243-.00481877-.10910149-.01521525-.35590459-.01433687-.56066672.00670546-.67705709.03834708-.21223125.22887-.4499778.40434754-.50241339.24641865-.07323589.51640341-.09179599.73269877-.04707051.20703808.0423346.44864736.20171736.51796318.32062499.08353628.14399789.15516008.36337367.21006107.63530456.04431149.21947986.07480439.45493493.0962536.70624261.00667352.0781897.01103024.13859819.01772256.23854675.00285005.04183594.00285005.04183594.00568968.07635213.00160285.01731471.00160285.01731471.00551199.04467336.00303535.01917374.00303535.01917374.01734216.06773608.00727602.13782339.00727602.13782339.56081544.18893151.16530264-.19982737.16530264-.19982737.16077268-.23486454.02708074-.1183491.04365279-.250265.06727822-.49813693.01508098-.16112409.02268576-.24033521.03157416-.32249887.036794-.34012028.0835164-.55621578.140511-.65120691.0707148-.11819408.3197845-.28280909.4314962-.30279961.2805348-.04961763.5886064-.0551978.8264635-.00901194.1077347.021202.3705429.22413969.4327499.32121002.1277282.20156171.2519621.8513817.3219188 1.49611734-.0110122.04228902-.0110122.04228902.1607163.28760404.5903408-.06730286.5903408-.06730286.5737568-.17389206.0155734-.03799147.0279666-.08191522.0455068-.15013809.0421947-.1597068.0701719-.25243998.1118273-.35635899.0288165-.07188915.0591935-.13335501.0903398-.18227881.120675-.18992919.4330876-.31896311.7070596-.2766556.2942545.0454396.4817569.26665023.4998934.72896761.0145423.38042999.0188438.52667972.0198445.67022961.0003693.0529684.0003531.09548963.0000723.21509672-.0001536.07391241-.0001536.07391241-.000205.16397385 0 .48892448-.010469.79353263-.0389535 1.17400348-.0506294.653266-.1361064 1.34281542-.228649 1.66708482-.094456.330596-.3764591.9508823-.5997469 1.2734975-.0158389.0153017-.0838055.0964468-.1706932.2036597-.1445918.1784155-.2892331.364998-.4248114.5512865-.0725632.099704-.140705.1968792-.2036767.2908847-.2436695.3637558-.4000227.6607868-.4506249.9042828-.0664376.3164194-.0901813.4842425-.0973169.666189-.0017426.0515155-.0017426.0515155-.0028439.1014735-.0025547.1180556-.0040857.165727-.0090621.2520573-.0052398.0906702-.0037444.1871795.0035093.2891187.0103883.145992.0000001.3454812.0000001.3454812s-.1266332-.0118299-.2678551-.0085813c-.1725177.0039685-.3159859-.0019087-.4151297-.0177442-.143046-.0230487-.5293508-.5064503-.7271506-.8830611-.3022704-.5764228-1.03604858-.5484427-1.33684295-.0394061-.27130191.4618137-.65965243.9172085-.77493336.9317029-.37460536.047106-.95471158.0524702-2.07175566.0332544-.10679478-.0018572-.10679478-.0018572-.21348729-.0037567-.42889761-.0076439-.41241496.0647655-.40363307-.0124079.02506967-.2203068.02222332-.1790312.00000011-.3992999-.03726222-.36933-.15125405-.6704984-.38877094-.8705429-.12286946-.1043424-.26983033-.2407345-.56500741-.5211097-.33722428-.3203411-.44283686-.4193233-.57299128-.5337266l-.80130455-.8907189c-.08795856-.1124788-.86002339-1.4339349-1.21248613-1.9454077-.13710846-.19857111-.18839645-.26302343-.71461353-.9114734zm9.50873056.0037599v3.459c0 .5.75.5.75 0v-3.459c0-.5-.75-.5-.75 0zm-2.03159602-.00057241.016 3.47300001c.00230346.4999947.7522955.4965395.74999204-.0034552l-.016-3.47299999c-.00230346-.4999947-.7522955-.49653951-.74999204.00345518zm-1.20911102 3.45357381-.021-3.42599996c-.00306475-.4999906-.75305066-.49539349-.74998592.00459712l.021 3.42600004c.00306475.4999906.75305066.4953935.74998592-.0045972z"
            fill="#fff"
          />
        </g>
      </svg>
    `;
  }
  getCustomCursorSVG(t, n) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 0 0.25rem ${t}); pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <image href="${n}" width="32" height="32"></image>
        </g>
      </svg>
    `;
  }
  removeCursor(t) {
    const n = this.cursors.get(t);
    if (n) {
      n.classList.remove("playhtml-cursor-fade-in"), n.classList.add("playhtml-cursor-fade-out");
      const r = this.pendingRemovals.get(t);
      r && clearTimeout(r);
      const i = setTimeout(() => {
        n.remove(), this.cursors.delete(t), this.pendingRemovals.delete(t);
      }, 300);
      this.pendingRemovals.set(t, i);
    }
    const s = this.cursorAnimators.get(t);
    s && (s.destroy(), this.cursorAnimators.delete(t)), this.cursorZoneState.delete(t);
  }
  savePlayerIdentityToStorage() {
    try {
      localStorage.setItem(
        Un,
        JSON.stringify(this.playerIdentity)
      );
    } catch (t) {
      console.warn("Failed to save player identity to localStorage:", t);
    }
  }
  setupGlobalAPI() {
    const t = this;
    window.cursors = {
      get allColors() {
        return Array.from(t.allPlayerColors);
      },
      set allColors(n) {
        t.allPlayerColors = new Set(n), t.emitGlobalEvent("allColors", n);
      },
      get color() {
        return it(t.playerIdentity);
      },
      set color(n) {
        if (n == null || n === "")
          throw new Error(
            "[playhtml] cursor.color cannot be set to empty; player identity must have a primary color."
          );
        const s = t.playerIdentity.playerStyle.colorPalette[0];
        t.playerIdentity.playerStyle.colorPalette[0] = n, t.savePlayerIdentityToStorage(), document.documentElement.style.cursor = gn(n), s !== n && t.emitGlobalEvent("color", n);
      },
      get name() {
        return t.playerIdentity.name;
      },
      set name(n) {
        const s = t.playerIdentity.name;
        t.playerIdentity.name = n, t.savePlayerIdentityToStorage(), s !== n && t.emitGlobalEvent("name", n);
      },
      on: (n, s) => {
        t.globalApiListeners.has(n) || t.globalApiListeners.set(n, /* @__PURE__ */ new Set()), t.globalApiListeners.get(n).add(s);
      },
      off: (n, s) => {
        const r = t.globalApiListeners.get(n);
        r && r.delete(s);
      }
    };
  }
  emitGlobalEvent(t, n) {
    const s = this.globalApiListeners.get(t);
    s && s.forEach((r) => r(n));
  }
  updateGlobalColors() {
    if (window.cursors) {
      const t = Array.from(this.allPlayerColors);
      window.cursors.allColors = t;
    }
  }
  updateChatCTA() {
    this.chat && (this.otherUsersWithMessages.size > 0 ? this.chat.showCTA() : this.chat.hideCTA());
  }
  updateCursorMessage(t, n, s) {
    const r = t.querySelector(".playhtml-cursor-message");
    if (r && r.remove(), s) {
      const i = document.createElement("div");
      i.className = "playhtml-cursor-message", i.style.cssText = `
        position: absolute;
        font-size: 16px;
        font-style: normal;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        color: white;
        padding: 4px 9px 4px 9px;
        border-radius: 16px 16px 16px 16px;
        white-space: nowrap;
        background-color: rgba(52,199,89,1);
        top: 17px;
        left: 22px;
      `, i.textContent = s, t.appendChild(i);
    }
  }
  updateCursorName(t, n) {
    const s = t.querySelector(".playhtml-cursor-name");
    s && s.remove();
    const r = n?.name;
    if (r && n) {
      const i = it(n), o = r.length > 10 ? r.slice(0, 10) + ".." : r, c = this.opacifyColor(i, 0.6), l = this.opacifyColor(i, 0.3), a = this.getContrastColor(i), h = document.createElement("div");
      h.className = "playhtml-cursor-name", h.style.cssText = `
        position: absolute;
        white-space: nowrap;
        padding: 4px 6px;
        font-size: 12px;
        background: ${i};
        border-radius: 14px;
        top: 14px;
        left: 18px;
        opacity: 0.75;
        border: 1px solid ${c};
        box-shadow: 1px 1px 4px 2px ${l};
        color: ${a};
      `, h.textContent = o, t.appendChild(h);
    }
  }
  opacifyColor(t, n) {
    if (t.startsWith("#")) {
      const s = t.replace("#", ""), r = parseInt(s.substring(0, 2), 16), i = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
      return `rgba(${r}, ${i}, ${o}, ${n})`;
    } else {
      if (t.startsWith("rgba"))
        return t.replace(/[\d\.]+\)$/, `${n})`);
      if (t.startsWith("rgb"))
        return t.replace("rgb", "rgba").replace(")", `, ${n})`);
      if (t.startsWith("hsl")) {
        const s = t.match(
          /hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/
        );
        if (s) {
          const [, r, i, o] = s.map(Number), [c, l, a] = this.hslToRgb(r, i, o);
          return `rgba(${c}, ${l}, ${a}, ${n})`;
        }
      }
    }
    return t;
  }
  hslToRgb(t, n, s) {
    t /= 360, n /= 100, s /= 100;
    let r, i, o;
    if (n === 0)
      r = i = o = s;
    else {
      const c = (h, u, d) => (d < 0 && (d += 1), d > 1 && (d -= 1), d < 0.16666666666666666 ? h + (u - h) * 6 * d : d < 0.5 ? u : d < 0.6666666666666666 ? h + (u - h) * (0.6666666666666666 - d) * 6 : h), l = s < 0.5 ? s * (1 + n) : s + n - s * n, a = 2 * s - l;
      r = c(a, l, t + 1 / 3), i = c(a, l, t), o = c(a, l, t - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(i * 255), Math.round(o * 255)];
  }
  getLuminance(t) {
    let n, s, r;
    if (t.startsWith("#")) {
      const l = t.replace("#", "");
      n = parseInt(l.substring(0, 2), 16), s = parseInt(l.substring(2, 4), 16), r = parseInt(l.substring(4, 6), 16);
    } else if (t.startsWith("rgb")) {
      const l = t.match(/\d+/g);
      if (!l || l.length < 3) return 0;
      [n, s, r] = l.map(Number);
    } else if (t.startsWith("hsl")) {
      const l = t.match(/\d+(\.\d+)?/g);
      if (!l || l.length < 3) return 0;
      const [a, h, u] = l.map(Number);
      [n, s, r] = this.hslToRgb(a, h, u);
    } else
      return 0;
    const [i, o, c] = [n / 255, s / 255, r / 255].map(
      (l) => l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * i + 0.7152 * o + 0.0722 * c;
  }
  getContrastColor(t) {
    return this.getLuminance(t) > 0.5 ? "#000000" : "#ffffff";
  }
  updateAllCursorVisibility() {
    if (!this.currentCursor || !this.visibilityThreshold) return;
    const t = bt(
      this.currentCursor.x,
      this.currentCursor.y,
      this.coordinateMode
    );
    this.cursors.forEach((n, s) => {
      const i = this.spatialGrid.getAll().find((o) => o.id === s)?.data;
      if (i && i.cursor) {
        const o = bt(
          i.cursor.x,
          i.cursor.y,
          this.coordinateMode
        ), l = Ss(
          { ...t, pointer: this.currentCursor.pointer },
          { ...o, pointer: i.cursor.pointer }
        ) < this.visibilityThreshold;
        n.style.display = l ? "block" : "none", n.style.opacity = l ? "1" : "0", n.dataset.animating || (n.style.transform = l ? "scale(1)" : "scale(0.8)");
      }
    });
  }
  showAllCursors() {
    this.cursors.forEach((t) => {
      t.style.display = "block", t.style.opacity = "1", t.dataset.animating || (t.style.transform = "scale(1)");
    });
  }
  configure(t) {
    Object.assign(this.options, t), t.visibilityThreshold !== void 0 && (this.visibilityThreshold = t.visibilityThreshold, this.updateAllCursorVisibility()), t.playerIdentity !== void 0 && (Hi(t.playerIdentity), this.playerIdentity = t.playerIdentity, this.savePlayerIdentityToStorage(), document.documentElement.style.cursor = gn(
      it(this.playerIdentity)
    ), this.updateCursorAwareness());
  }
  registerZone(t, n) {
    if (!t.id)
      throw new Error("[playhtml] Zone element must have an id attribute.");
    this.zones.set(t.id, { element: t, options: n });
  }
  unregisterZone(t) {
    this.zones.delete(t);
  }
  hideCursor(t) {
    const n = this.cursors.get(t);
    n && (n.style.display = "none");
  }
  showCursor(t) {
    const n = this.cursors.get(t);
    n && (n.style.display = "block");
  }
  destroy() {
    this.cursors.forEach((t) => t.remove()), this.cursors.clear(), this.cursorAnimators.forEach((t) => t.destroy()), this.cursorAnimators.clear(), this.spatialGrid.clear(), this.zones.clear(), this.cursorZoneState.clear(), this.clientIdToStableId.clear(), this.pendingRemovals.forEach((t) => clearTimeout(t)), this.pendingRemovals.clear(), this.chat && this.chat.destroy(), this.provider.awareness.setLocalStateField(ke, null);
  }
  // Debug method to inspect spatial partitioning efficiency
  getDebugInfo() {
    const t = this.spatialGrid.getItemCount(), n = this.spatialGrid.getCellCount();
    return {
      totalCursors: t,
      gridCells: n,
      avgCursorsPerCell: n > 0 ? t / n : 0
    };
  }
  // Instance-level subscription API (mirrors window.cursors.on/off)
  on(t, n) {
    this.globalApiListeners.has(t) || this.globalApiListeners.set(t, /* @__PURE__ */ new Set()), this.globalApiListeners.get(t).add(n);
  }
  off(t, n) {
    const s = this.globalApiListeners.get(t);
    s && s.delete(n);
  }
  // Snapshot of current cursor-related values for consumers
  getSnapshot() {
    return {
      allColors: Array.from(this.allPlayerColors),
      color: it(this.playerIdentity),
      name: this.playerIdentity.name ?? void 0
    };
  }
  // Get my player identity (including stable publicKey)
  getMyPlayerIdentity() {
    return this.playerIdentity;
  }
  // Get the provider (needed for awareness access)
  getProvider() {
    return this.provider;
  }
  // Get all cursor presences keyed by stable ID (slim shape for rendering).
  // Cursor coordinates are converted from storage (e.g. viewport % when coordinateMode is "relative")
  // to client pixel coordinates so consumers can use them directly for CSS left/top.
  getCursorPresences() {
    const t = /* @__PURE__ */ new Map();
    return this.provider.awareness.getStates().forEach((s, r) => {
      const i = Ee(
        s
      );
      if (!i) return;
      const o = $t(
        s,
        r
      ), c = bt(
        i.cursor.x,
        i.cursor.y,
        this.coordinateMode
      );
      t.set(o, {
        cursor: {
          x: c.x,
          y: c.y,
          pointer: i.cursor.pointer
        },
        playerIdentity: i.playerIdentity,
        zone: i.zone
      });
    }), t;
  }
  // Subscribe to cursor presence changes
  onCursorPresencesChange(t) {
    const n = Math.random().toString(36);
    return this.cursorPresenceChangeCallbacks.set(n, t), () => {
      this.cursorPresenceChangeCallbacks.delete(n);
    };
  }
  // Notify listeners of cursor presence changes
  notifyCursorPresenceListeners() {
    const t = this.getCursorPresences();
    this.cursorPresenceChangeCallbacks.forEach((n) => n(t));
  }
  /**
   * Apply a CSS class to a specific cursor element identified by the player's stableId (publicKey).
   * The class is added to the actual rendered cursor DOM element and removed after `durationMs`.
   * Returns true if the cursor element was found and the animation was applied.
   */
  triggerCursorAnimation(t, n, s = 1500) {
    const r = this.activeAnimationCleanups.get(t);
    if (r && r(), t === this.playerIdentity.publicKey)
      return this.triggerSelfCursorAnimation(n, s);
    const o = this.cursors.get(t);
    if (!o) return !1;
    const c = o.querySelector("svg") ?? o;
    o.dataset.animating = "true";
    const l = o.style.display, a = o.style.opacity;
    o.style.display = "block", o.style.opacity = "1";
    const h = o.style.transition;
    o.style.transition = "none", c.classList.add(n);
    let u = !1;
    const d = () => {
      u || (u = !0, c.classList.remove(n), delete o.dataset.animating, o.style.transition = h, o.style.display = l, o.style.opacity = a, this.activeAnimationCleanups.delete(t));
    };
    this.activeAnimationCleanups.set(t, d);
    const f = () => {
      d(), c.removeEventListener("animationend", f);
    };
    return c.addEventListener("animationend", f), window.setTimeout(f, s), !0;
  }
  // Create a temporary ghost cursor at the local player's position and animate it
  triggerSelfCursorAnimation(t, n) {
    if (!this.currentCursor) return !1;
    const s = it(this.playerIdentity), r = bt(
      this.currentCursor.x,
      this.currentCursor.y,
      this.coordinateMode
    ), i = document.createElement("div");
    i.className = `playhtml-cursor-other ${t}`, i.style.cssText = `
      position: fixed;
      left: ${r.x - 16}px;
      top: ${r.y - 16}px;
      width: 32px;
      height: 32px;
      z-index: 999999;
      pointer-events: none;
      opacity: 0.3;
      transform-origin: top left;
    `, i.innerHTML = this.getMouseCursorSVG(s), document.body.appendChild(i);
    const o = this.playerIdentity.publicKey;
    let c = !1;
    const l = () => {
      c || (c = !0, i.removeEventListener("animationend", a), i.remove(), this.activeAnimationCleanups.delete(o));
    };
    this.activeAnimationCleanups.set(o, l);
    const a = () => l();
    return i.addEventListener("animationend", a), window.setTimeout(l, n), !0;
  }
}
const yn = "__presence__", $i = "__playhtml_cursors__", Vd = /* @__PURE__ */ new Set(["playerIdentity", "cursor", "isMe"]);
function Pc(e) {
  const t = /* @__PURE__ */ new Map();
  let n = !1, s = 0;
  function r() {
    return e.getAwareness();
  }
  function i(h, u) {
    const d = [], f = Array.from(h.keys()).sort((p, g) => p - g);
    for (const p of f) {
      const g = h.get(p);
      if (!g) continue;
      let w;
      u === "cursor" ? w = g[$i]?.cursor : w = g[yn]?.[u];
      try {
        d.push(`${p}:${JSON.stringify(w ?? null)}`);
      } catch {
        d.push(`${p}:null`);
      }
    }
    return d.join("|");
  }
  function o() {
    n || (n = !0, r().on("change", () => {
      if (t.size === 0) return;
      const h = r().getStates();
      let u = null;
      const d = () => (u || (u = a()), u);
      for (const f of t.values()) {
        const p = i(
          h,
          f.channel
        );
        p !== f.lastFingerprint && (f.lastFingerprint = p, f.callback(d()));
      }
    }));
  }
  function c(h, u) {
    const d = h[$i], f = d?.playerIdentity, p = d?.cursor ?? null, g = h[yn] ?? {}, w = {
      playerIdentity: f,
      cursor: p,
      isMe: u
    };
    for (const [x, E] of Object.entries(g))
      !Vd.has(x) && E != null && (w[x] = E);
    return w;
  }
  function l() {
    const h = r(), u = h.getLocalState();
    return u ? $t(u, h.clientID) : e.getPlayerIdentity().publicKey;
  }
  function a() {
    const h = /* @__PURE__ */ new Map(), u = r(), d = u.getStates(), f = u.clientID;
    let p = !1;
    if (d.forEach((g, w) => {
      const x = w === f;
      x && (p = !0);
      const E = $t(g, w), I = c(g, x);
      h.set(E, I);
    }), !p) {
      const g = u.getLocalState() ?? {}, w = c(g, !0);
      w.playerIdentity = e.getPlayerIdentity(), h.set(l(), w);
    }
    return h;
  }
  return {
    setMyPresence(h, u) {
      const d = r(), p = (d.getLocalState() ?? {})[yn] ?? {};
      let g;
      if (u == null) {
        const { [h]: w, ...x } = p;
        g = x;
      } else
        g = { ...p, [h]: u };
      d.setLocalStateField(yn, g);
    },
    getPresences() {
      return a();
    },
    onPresenceChange(h, u) {
      const d = String(s++);
      return t.set(d, { channel: h, callback: u, lastFingerprint: "" }), o(), () => {
        t.delete(d);
      };
    },
    getMyIdentity() {
      return e.getPlayerIdentity();
    }
  };
}
function $d() {
  const e = [];
  return document.querySelectorAll("[shared]").forEach((t) => {
    if (!t.id) return;
    let n = "read-write";
    const s = t.getAttribute("shared");
    if (s && s !== "") {
      const r = s.toLowerCase();
      (r.includes("read-only") || r === "ro") && (n = "read-only");
    }
    e.push({
      elementId: t.id,
      permissions: n,
      path: window.location.pathname
    });
  }), e;
}
function Yd() {
  const e = [];
  return document.querySelectorAll("[data-source]").forEach((t) => {
    const n = t.getAttribute("data-source");
    if (n)
      try {
        const { domain: s, path: r, elementId: i } = xc(n);
        e.push({ domain: s, path: r, elementId: i });
      } catch {
      }
  }), e;
}
function Kd(e, t) {
  if (e.hasAttribute("data-source") && e.hasAttribute("data-source-read-only")) return !0;
  const r = t ?? _r(e);
  return r ? Ke.get(r) === "read-only" : !1;
}
const ot = "__page__";
function Gd(e, t, n) {
  const {
    ensureProxy: s,
    getProxy: r,
    doc: i,
    storePlay: o,
    proxyByTagAndId: c,
    yObserverByKey: l,
    channelRefCounts: a,
    channelListeners: h
  } = n;
  o[ot] ??= {}, s(ot, e, t), h.has(e) || h.set(e, /* @__PURE__ */ new Set());
  const u = h.get(e), d = /* @__PURE__ */ new Set(), f = (a.get(e) ?? 0) + 1;
  if (a.set(e, f), f === 1) {
    const g = kt(o[ot]?.[e]);
    if (g && typeof g.observeDeep == "function") {
      let w = !1;
      const x = () => {
        w || (w = !0, queueMicrotask(() => {
          w = !1;
          const E = o[ot]?.[e];
          if (!E) return;
          const I = Fe(E);
          for (const G of u)
            G(I);
        }));
      };
      g.observeDeep(x), l.set(`${ot}:${e}`, x);
    }
  }
  let p = !1;
  return {
    getData() {
      if (p) throw new Error(`PageDataChannel "${e}" has been destroyed`);
      return Fe(o[ot]?.[e] ?? t);
    },
    setData(g) {
      if (p) throw new Error(`PageDataChannel "${e}" has been destroyed`);
      const w = r(ot, e);
      if (!w)
        throw new Error(`PageDataChannel "${e}" proxy not found — data may have been cleaned up`);
      typeof g == "function" ? i.transact(() => {
        g(w);
      }) : i.transact(() => {
        Nn(w, g);
      });
    },
    onUpdate(g) {
      if (p) throw new Error(`PageDataChannel "${e}" has been destroyed`);
      return u.add(g), d.add(g), () => {
        u.delete(g), d.delete(g);
      };
    },
    destroy() {
      if (p) return;
      p = !0;
      for (const w of d)
        u.delete(w);
      d.clear();
      const g = (a.get(e) ?? 1) - 1;
      if (a.set(e, g), g <= 0) {
        a.delete(e), h.delete(e);
        const w = `${ot}:${e}`, x = l.get(w);
        if (x) {
          const I = kt(o[ot]?.[e]);
          I && typeof I.unobserveDeep == "function" && I.unobserveDeep(x), l.delete(w);
        }
        const E = c.get(ot);
        E && E.delete(e);
      }
    }
  };
}
const Wd = "playhtml.spencerc99.partykit.dev", Xd = "staging.playhtml.spencerc99.partykit.dev";
function Jd(e) {
  if (e)
    return e;
  const t = window.location.hostname;
  return t.includes("staging") || t.includes("ngrok-free") ? Xd : Wd;
}
const at = Rd({ play: {} }), me = Td(at);
function Zd({ includeSearch: e }) {
  const t = window.location.pathname.replace(/\.[^/.]+$/, "");
  return e ? t + window.location.search : t;
}
function mn(e) {
  return e.replace(/\.[^/.]+$/, "");
}
function qd(e) {
  const t = {
    domain: window.location.host,
    pathname: window.location.pathname,
    search: window.location.search
  };
  if (typeof e == "function") {
    const n = e(t);
    return n && n.startsWith("/") ? mn(n) : n;
  }
  switch (e) {
    case "page":
      return mn(t.pathname);
    case "domain":
      return "";
    case "section":
      return `/${mn(t.pathname).split("/").filter(Boolean)[0] || ""}`;
    default:
      return mn(t.pathname);
  }
}
function Ks(e, t) {
  const n = Zu(e), s = t === "" ? n : `${n}-${t}`;
  return encodeURIComponent(s);
}
let N, Es = null, ct = null, Gs = null;
me.getMap("playhtml-global");
const Wt = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), Qd = /* @__PURE__ */ new Map(), tf = /* @__PURE__ */ new Map(), Ws = /* @__PURE__ */ new Set(), Le = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map(), Xs = /* @__PURE__ */ new Set();
function ef() {
  Ke.size === 0 && Ke.clear();
}
function nf(e) {
  const t = e.getAttribute("data-source");
  if (!t) return;
  let n, s, r;
  try {
    ({ domain: n, path: s, elementId: r } = xc(t));
  } catch {
    return;
  }
  const i = `${n}${s}#${r}`;
  if (!Xs.has(i) && (Xs.add(i), N?.ws && N.ws.readyState === WebSocket.OPEN))
    try {
      const o = { domain: n, path: s, elementId: r };
      N.ws.send(
        JSON.stringify({
          type: "add-shared-reference",
          reference: o
        })
      ), N.ws.send(
        JSON.stringify({
          type: "export-permissions",
          elementIds: [r]
        })
      );
    } catch (o) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared reference:",
        o
      );
    }
}
function sf(e) {
  if (!e.id) return;
  const t = e.id, n = e.getAttribute("shared");
  let s = "read-write";
  if (n && n !== "") {
    const r = n.toLowerCase();
    (r.includes("read-only") || r === "ro") && (s = "read-only");
  }
  if (Ke.set(t, s), N?.ws && N.ws.readyState === WebSocket.OPEN)
    try {
      const r = {
        elementId: t,
        permissions: s,
        path: window.location.pathname
      };
      N.ws.send(
        JSON.stringify({
          type: "register-shared-element",
          element: r
        })
      );
    } catch (r) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared element:",
        r
      );
    }
}
function Bc(e, t, n) {
  Wt.has(e) || Wt.set(e, /* @__PURE__ */ new Map());
  const s = Wt.get(e);
  if (!s.has(t)) {
    at.play[e] ??= {};
    const r = at.play[e];
    if (r[t] === void 0) {
      const i = Fe(n);
      r[t] = i;
    }
    s.set(t, r[t]);
  }
  return s.get(t);
}
let ht = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map();
const Yi = /* @__PURE__ */ new Set(), Ki = /* @__PURE__ */ new Map();
let rf = 0, ns = id;
function Ge() {
  return [Dr.CanPlay, ...Object.keys(ns)];
}
function of(e) {
  N.ws && N.ws.send(JSON.stringify(e));
}
function cf(e) {
  if (e.data instanceof Blob)
    return;
  let t;
  try {
    t = JSON.parse(e.data);
  } catch {
    return;
  }
  if (t.type === "room-reset") {
    if (console.warn(
      `[PLAYHTML] Received room-reset message with epoch=${t.resetEpoch}. Storing and reloading...`
    ), t.resetEpoch) {
      const i = `playhtml_resetEpoch_${Tr}`;
      localStorage.setItem(i, String(t.resetEpoch)), console.log(
        `[PLAYHTML] Stored resetEpoch=${t.resetEpoch} in localStorage key=${i}`
      );
    }
    window.location.reload();
    return;
  }
  const { type: n, eventPayload: s } = t, r = te.get(n);
  if (!r) {
    if (t.permissions)
      try {
        const i = t.permissions;
        Object.entries(i).forEach(([o, c]) => {
          if (Ke.set(o, c), c === "read-only") {
            const l = document.querySelector(
              `[data-source$="#${CSS.escape(o)}"]`
            );
            l && l.setAttribute("data-source-read-only", "");
          }
        });
      } catch {
      }
    return;
  }
  for (const i of r)
    i.onEvent(s);
}
let Ct = !1, Js = !0, Gi = null, jc = !1, Tr = "", Or = "";
async function lf({
  // TODO: if it is a localhost url, need to make some deterministic way to connect to the same room.
  host: e,
  extraCapabilities: t,
  events: n,
  defaultRoomOptions: s = { includeSearch: !1 },
  room: r = Zd(s),
  onError: i,
  developmentMode: o = !1,
  cursors: c = {}
} = {}) {
  if (!Js || "playhtml" in window) {
    console.error("playhtml already set up! ignoring");
    return;
  }
  jc = o, window.playhtml = Wi, document.documentElement.dataset.playhtml = "true";
  const l = Ks(window.location.host, r), a = Jd(e);
  Tr = l, Or = a, console.log(
    `࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂
࿂࿂࿂࿂  ࿂    ࿂    ࿂    ࿂    ࿂  ࿂࿂࿂࿂
࿂࿂࿂࿂ booting up playhtml... ࿂࿂࿂࿂
࿂࿂࿂࿂  https://playhtml.fun  ࿂࿂࿂࿂
࿂࿂࿂࿂   ࿂     ࿂     ࿂     ࿂   ࿂࿂࿂࿂
࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂`
  );
  const h = $d(), u = Yd();
  ef(), u.forEach((x) => {
    const E = `${x.domain}${x.path}#${x.elementId}`;
    Xs.add(E);
  });
  const d = `playhtml_resetEpoch_${l}`, f = localStorage.getItem(d), p = f ? parseInt(f, 10) : null;
  if (N = new Ps(a, l, me, {
    params: {
      sharedElements: JSON.stringify(h),
      sharedReferences: JSON.stringify(u),
      clientResetEpoch: p !== null ? String(p) : null
    }
  }), N.on("error", () => {
    i?.();
  }), queueMicrotask(() => {
    N.ws ? N.ws.addEventListener("message", cf) : console.warn(
      "[PLAYHTML] WebSocket not available in microtask, onMessage handler not attached"
    );
  }), c.enabled) {
    const x = {
      ...c
    };
    x.playerIdentity || (x.playerIdentity = Pn());
    let E = N;
    if (x.room) {
      const I = qd(x.room), G = Ks(
        window.location.host,
        I
      );
      if (G !== l) {
        const Nt = new mt();
        Es = new Ps(
          a,
          G,
          Nt
        ), Es.on("error", () => {
          i?.();
        }), E = Es;
      }
    }
    ct = new Hd(E, x), document.addEventListener("playhtml:configure-identity", ((I) => {
      const G = I.detail?.playerIdentity;
      if (!G || !ct) return;
      const rt = {
        ...ct.getMyPlayerIdentity(),
        publicKey: G.publicKey,
        playerStyle: G.playerStyle
      };
      ct.configure({ playerIdentity: rt }), console.log("[playhtml] Merged extension identity via CustomEvent");
    })), document.dispatchEvent(new CustomEvent("playhtml:ready"));
  }
  const g = ct?.getProvider() ?? N;
  if (Gs = Pc({
    getAwareness: () => g.awareness,
    getPlayerIdentity: () => ct?.getMyPlayerIdentity() ?? Pn()
  }), t)
    for (const [x, E] of Object.entries(t))
      ns[x] = E;
  if (n)
    for (const [x, E] of Object.entries(n))
      $c(x, E);
  const w = document.createElement("link");
  return w.rel = "stylesheet", w.href = "https://unpkg.com/playhtml@latest/dist/style.css", document.head.appendChild(w), o && ad(Wi), hf(), await new Promise((x) => {
    Ct && x(!0), N.on("sync", (E) => {
      if (E || console.error("Issue connecting to yjs..."), !Ct) {
        if (Ct = !0, console.log("[PLAYHTML]: Setting up elements... Time to have some fun 🛝"), Vc(), uf(), u.length > 0)
          try {
            const I = u.map((G) => G.elementId);
            N.ws?.send(
              JSON.stringify({ type: "export-permissions", elementIds: I })
            );
          } catch (I) {
            console.error("[PLAYHTML] Error during post-sync setup:", I);
          }
        x(!0);
      }
    });
  }), N;
}
function af(e, t) {
  return ((ct?.getProvider() ?? N).awareness.getLocalState()?.[e] ?? {})[t];
}
function ss(e) {
  return e instanceof HTMLElement;
}
function zc(e) {
  return e.hasAttribute("can-play") ? "none" : "animate";
}
function Fc(e) {
  if ((e.getAttribute("loading-behavior") || zc(e)) === "none") return;
  e.classList.add("playhtml-loading");
  const n = e.getAttribute("loading-class");
  n && e.classList.add(n), e.setAttribute("aria-busy", "true"), e.setAttribute("aria-live", "polite");
}
function Hc(e) {
  if ((e.getAttribute("loading-behavior") || zc(e)) === "none") return;
  e.classList.remove("playhtml-loading");
  const n = e.getAttribute("loading-class");
  n && e.classList.remove(n), e.removeAttribute("aria-busy"), e.removeAttribute("aria-live");
}
function hf() {
  for (const e of Ge())
    Array.from(
      document.querySelectorAll(`[${e}]`)
    ).filter(ss).forEach((n) => {
      Fc(n);
    });
}
function uf() {
  for (const e of Ge())
    Array.from(
      document.querySelectorAll(`[${e}]`)
    ).filter(ss).forEach((n) => {
      Hc(n);
    });
}
function df(e, t, n, s) {
  const r = n.defaultData instanceof Function ? n.defaultData(e) : n.defaultData, i = Bc(
    t,
    s,
    r
  );
  return {
    ...n,
    // Always provide a plain snapshot to render paths
    data: Fe(i),
    awareness: af(t, s) ?? n.myDefaultAwareness !== void 0 ? [n.myDefaultAwareness] : void 0,
    element: e,
    onChange: (c) => {
      const l = _r(e);
      Kd(e, l) || (typeof c == "function" ? me.transact(() => {
        c(i);
      }) : me.transact(() => {
        Nn(i, c);
      }));
    },
    onAwarenessChange: (c) => {
      const l = ct?.getProvider() ?? N, a = l.awareness.getLocalState()?.[t] || {};
      a[s] !== c && (a[s] = c, l.awareness.setLocalStateField(t, a));
    },
    triggerAwarenessUpdate: () => {
      Zs();
    }
  };
}
function ff(e) {
  return e != null && e.defaultData !== void 0 && (typeof e.defaultData == "object" || typeof e.defaultData == "function") && e.updateElement !== void 0;
}
function pf(e) {
  const t = e, n = {}, s = [
    "defaultData",
    "defaultLocalData",
    "myDefaultAwareness",
    "updateElement",
    "updateElementAwareness",
    "onDrag",
    "onDragStart",
    "onClick",
    "onMount",
    "resetShortcut",
    "debounceMs",
    "isValidElementForTag"
  ];
  for (const r of s)
    t[r] !== void 0 && (n[r] = t[r]);
  return t.additionalSetup !== void 0 && n.onMount === void 0 && (n.onMount = t.additionalSetup), n;
}
function gf(e, t) {
  const n = pf(t);
  if (e === Dr.CanPlay)
    return n;
  const s = ns[e];
  if (s)
    return { ...s, ...n };
}
function Zs() {
  const t = (ct?.getProvider() ?? N).awareness.getStates(), n = Pd(
    t
  );
  if (n === Gi)
    return;
  Gi = n;
  const s = /* @__PURE__ */ new Map();
  t.forEach((r, i) => {
    const o = $t(
      r,
      i
    );
    Object.keys(r).forEach((c) => {
      if (c.startsWith("__")) return;
      const l = r[c];
      !l || typeof l != "object" || Object.keys(l).forEach((a) => {
        const h = l[a], u = `${c}:${a}`;
        s.has(u) || s.set(u, { array: [], byStableId: /* @__PURE__ */ new Map() });
        const d = s.get(u);
        d.array.push(h), d.byStableId.set(o, h);
      });
    });
  }), s.forEach(({ array: r, byStableId: i }, o) => {
    const c = o.indexOf(":"), l = o.slice(0, c), a = o.slice(c + 1), h = ht.get(l);
    if (!h) return;
    const u = h.get(a);
    u && u.updateAwareness(r, i);
  });
}
function Vc() {
  if (!Ct)
    return;
  for (const t of Ge()) {
    const n = Array.from(
      document.querySelectorAll(`[${t}]`)
    ).filter(ss);
    n.length && Promise.all(
      n.map((s) => Rr(s, t))
    );
  }
  if (!Js)
    return;
  (ct?.getProvider() ?? N).awareness.on("change", () => Zs()), Zs(), Js = !1;
}
function yf(e, t) {
  if (!Ct)
    throw new Error("playhtml.createPageData is not available before init()");
  return Gd(e, t, {
    ensureProxy: Bc,
    getProxy: (n, s) => Wt.get(n)?.get(s),
    doc: me,
    storePlay: at.play,
    proxyByTagAndId: Wt,
    yObserverByKey: Ye,
    channelRefCounts: Qd,
    channelListeners: tf
  });
}
function mf(e) {
  if (!Ct)
    throw new Error("playhtml.createPresenceRoom is not available before init()");
  const t = Ks(window.location.host, e), n = new mt(), s = new Ps(Or, t, n), r = Pc({
    getAwareness: () => s.awareness,
    getPlayerIdentity: () => ct?.getMyPlayerIdentity() ?? Pn()
  });
  let i = !1;
  return {
    presence: r,
    destroy: () => {
      i || (i = !0, s.destroy(), n.destroy());
    }
  };
}
const Wi = {
  init: lf,
  setupPlayElements: Vc,
  setupPlayElement: xf,
  removePlayElement: Cf,
  deleteElementData: vf,
  setupPlayElementForTag: Rr,
  syncedStore: at.play,
  elementHandlers: ht,
  eventHandlers: te,
  dispatchPlayEvent: Af,
  registerPlayEventListener: $c,
  removePlayEventListener: Sf,
  get cursorClient() {
    return ct;
  },
  get presence() {
    if (!Gs)
      throw new Error("playhtml.presence is not available before init()");
    return Gs;
  },
  // Filled after init
  get roomId() {
    return Tr;
  },
  get host() {
    return Or;
  },
  createPageData: yf,
  createPresenceRoom: mf,
  listSharedElements: Ac
};
function wf(e) {
  if (e === ot)
    throw new Error(`"${ot}" is a reserved tag name for page-level data`);
  ht.has(e) || Ct && (ht.has(e) || ht.set(e, /* @__PURE__ */ new Map()), at.play[e] ??= {});
}
function bf(e, t) {
  const n = e.isValidElementForTag;
  return typeof n == "function" ? n(e) : ns[t]?.isValidElementForTag?.(e) ?? !0;
}
async function Rr(e, t) {
  if (!bf(e, t) || !Ct)
    return;
  if (!e.id) {
    const o = e.getAttribute("selector-id");
    if (o) {
      const c = Ki.get(o) ?? 0;
      e.id = btoa(`${t}-${o}-${c}`), Ki.set(o, c + 1);
    } else
      e.id = await Ud(t, e);
  }
  const n = _r(e);
  if (!n) {
    console.error(
      `Element ${e} does not have an acceptable ID. Please add an ID to the element to register it as a playhtml element.`
    );
    return;
  }
  wf(t);
  const s = ht.get(t), r = gf(
    t,
    e
  );
  if (!ff(r)) {
    console.error(
      `Element ${n} does not have proper info to initial a playhtml element. Please refer to https://github.com/spencerc99/playhtml#can-play for troubleshooting help.`
    );
    return;
  }
  const i = df(
    e,
    t,
    r,
    n
  );
  if (s.has(n)) {
    s.get(n).reinitializeElementData(i), Xi(t, n);
    return;
  } else
    s.set(n, new Nd(i));
  i.triggerAwarenessUpdate?.(), e.classList.add("__playhtml-element"), e.style.setProperty("--jiggle-delay", `${Math.random() * 1}s;}`), Xi(t, n);
}
function Xi(e, t) {
  const n = `${e}:${t}`, s = ht.get(e);
  if (!s) return;
  const r = s.get(t);
  if (!r) return;
  const i = kt(at.play[e]?.[t]);
  if (!i || typeof i.observeDeep != "function") return;
  const o = Ye.get(n);
  o && i.unobserveDeep(o);
  let c = !1;
  const l = () => {
    c || (c = !0, queueMicrotask(() => {
      c = !1;
      const a = at.play[e]?.[t];
      if (!a) return;
      const h = Fe(a), u = `${e}:${t}`;
      Yi.add(u);
      try {
        r.__data = h;
      } finally {
        Yi.delete(u);
      }
      Ws.add(n);
    }));
  };
  if (i.observeDeep(l), Ye.set(n, l), jc) {
    const a = r.element;
    if (a && a.hasAttribute && a.hasAttribute("data-source") && !Le.has(n)) {
      const h = window.setTimeout(() => {
        Ws.has(n) || console.warn(
          `[playhtml] Shared reference ${e}:${t} has not received data. Check data-source and source availability.`
        ), Le.delete(n);
      }, 3e3);
      Le.set(n, h);
    }
  }
}
function xf(e, { ignoreIfAlreadySetup: t } = {}) {
  if (e.hasAttribute?.("data-source") && e.hasAttribute?.("shared")) {
    const s = e.id || "<no-id>";
    console.error(
      `[playhtml] Element ${s} has both 'data-source' and 'shared'. Ignoring. A single element cannot be both a consumer and a source.`
    );
    return;
  }
  if (t && Object.keys(ht || {}).some(
    (s) => ht.get(s)?.has(e.id)
  ))
    return;
  if (!ss(e)) {
    console.log(`Element ${e.id} not an HTML element. Ignoring.`);
    return;
  }
  e.hasAttribute("data-source") && nf(e), e.hasAttribute("shared") && sf(e), Ge().some(
    (s) => e.hasAttribute(s)
  ) && (Ct ? Hc(e) : Fc(e)), Promise.all(
    Ge().filter((s) => e.hasAttribute(s)).map((s) => Rr(e, s))
  );
}
function Cf(e) {
  if (!(!e || !e.id))
    for (const t of Object.keys(ht)) {
      const n = ht.get(t);
      n.has(e.id) && n.delete(e.id);
    }
}
function vf(e, t) {
  if (!Ct) {
    console.warn(
      `[PLAYHTML] Cannot remove element data before sync: ${e}:${t}`
    );
    return;
  }
  const n = `${e}:${t}`, s = kt(at.play[e]?.[t]);
  if (s && typeof s.observeDeep == "function") {
    const c = Ye.get(n);
    if (c) {
      try {
        s.unobserveDeep(c);
      } catch (l) {
        console.warn(`[PLAYHTML] Failed to remove observer for ${n}:`, l);
      }
      Ye.delete(n);
    }
  }
  if (at.play[e] && t in at.play[e])
    try {
      me.transact(() => {
        delete at.play[e][t];
      });
    } catch (c) {
      console.warn(
        `[PLAYHTML] Failed to remove SyncedStore data for ${n}:`,
        c
      );
    }
  const r = Wt.get(e);
  r && (r.delete(t), r.size === 0 && Wt.delete(e));
  const i = ht.get(e);
  i && i.delete(t), Ws.delete(n);
  const o = Le.get(n);
  o !== void 0 && (clearTimeout(o), Le.delete(n));
}
function Af(e) {
  const { type: t } = e;
  if (!te.has(t)) {
    console.error(`[playhtml] event "${t}" not registered.`);
    return;
  }
  of(e);
}
function $c(e, t) {
  const n = String(rf++);
  return te.set(e, [
    ...te.get(e) ?? [],
    { type: e, ...t, id: n }
  ]), n;
}
function Sf(e, t) {
  const n = te.get(e);
  if (!n)
    return;
  const s = n.findIndex((r) => r.id === t);
  s !== -1 && (n.splice(s, 1), n.length === 0 && te.delete(e));
}
export {
  Wi as playhtml,
  Ke as sharedPermissions
};
