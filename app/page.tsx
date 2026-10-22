"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import {
  Volume2,
  Plus,
  Minus,
  Camera,
  Check,
  CheckCircle2,
  MapPin,
  BadgeCheck,
  ArrowLeft,
  Home,
  WifiOff,
  Wifi,
  Recycle,
  ChevronRight,
  Clock,
  Package,
  Languages,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  i18n dictionary                                                    */
/* ------------------------------------------------------------------ */

type Lang = "hi" | "mr" | "en"

const LANGS: { code: Lang; label: string }[] = [
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "en", label: "English" },
]

// speechSynthesis locale per language
const SPEECH_LOCALE: Record<Lang, string> = {
  hi: "hi-IN",
  mr: "mr-IN",
  en: "en-IN",
}

const T = {
  appName: { hi: "कबाड़ीवाला कनेक्ट", mr: "कबाडीवाला कनेक्ट", en: "Kabadiwala Connect" },
  offline: { hi: "ऑफ़लाइन मोड", mr: "ऑफलाइन मोड", en: "Offline Mode" },
  offlineBanner: {
    hi: "ऑफ़लाइन मोड (डेटा बाद में सिंक होगा)",
    mr: "ऑफलाइन मोड (डेटा नंतर सिंक होईल)",
    en: "Offline Mode (data will sync later)",
  },
  todayRates: { hi: "आज के भाव (प्रति किलो)", mr: "आजचे भाव (प्रति किलो)", en: "Today's Rates (per kg)" },
  addLot: { hi: "नया कबाड़ जोड़ें", mr: "नवीन भंगार जोडा", en: "Add New Lot" },
  yourLots: { hi: "आपके लॉट", mr: "तुमचे लॉट", en: "Your Lots" },
  noLots: { hi: "अभी कोई लॉट नहीं है", mr: "अजून कोणतेही लॉट नाहीत", en: "No lots yet" },
  selectCategory: { hi: "श्रेणी चुनें", mr: "श्रेणी निवडा", en: "Select Category" },
  addPhoto: { hi: "फ़ोटो लें / अपलोड करें", mr: "फोटो घ्या / अपलोड करा", en: "Take / Upload Photo" },
  photoAdded: { hi: "फ़ोटो जुड़ गई", mr: "फोटो जोडली", en: "Photo added" },
  weight: { hi: "अनुमानित वज़न (किलो)", mr: "अंदाजे वजन (किलो)", en: "Approx Weight (kg)" },
  estPayout: { hi: "अनुमानित भुगतान", mr: "अंदाजे रक्कम", en: "Estimated Payout" },
  findRecycler: { hi: "रीसाइक्लर ढूंढें", mr: "रिसायकलर शोधा", en: "Find Recycler" },
  next: { hi: "आगे", mr: "पुढे", en: "Next" },
  nearbyRecyclers: { hi: "नज़दीकी रीसाइक्लर", mr: "जवळचे रिसायकलर", en: "Nearby Recyclers" },
  verified: { hi: "सत्यापित", mr: "पडताळलेले", en: "Verified" },
  offers: { hi: "देता है", mr: "देतो", en: "offers" },
  acceptOffer: { hi: "ऑफ़र स्वीकारें", mr: "ऑफर स्वीकारा", en: "Accept Offer" },
  receipt: { hi: "डिजिटल रसीद", mr: "डिजिटल पावती", en: "Digital Receipt" },
  lotId: { hi: "लॉट आईडी", mr: "लॉट आयडी", en: "Lot ID" },
  time: { hi: "समय", mr: "वेळ", en: "Time" },
  status: { hi: "स्थिति", mr: "स्थिती", en: "Status" },
  pending: {
    hi: "रीसाइक्लर की पुष्टि बाकी",
    mr: "रिसायकलरच्या पुष्टीची प्रतीक्षा",
    en: "Pending Recycler Confirmation",
  },
  savedOffline: {
    hi: "ऑफ़लाइन सहेजा गया — सिंक बाकी",
    mr: "ऑफलाइन जतन केले — सिंक बाकी",
    en: "Saved Offline — sync pending",
  },
  payout: { hi: "भुगतान", mr: "रक्कम", en: "Payout" },
  done: { hi: "हो गया", mr: "झाले", en: "Done" },
  backHome: { hi: "होम पर जाएं", mr: "होमवर जा", en: "Back to Home" },
  km: { hi: "किमी", mr: "किमी", en: "km" },
  listenGuide: { hi: "सुनें", mr: "ऐका", en: "Listen" },
}

function tr(key: keyof typeof T, lang: Lang) {
  return T[key][lang]
}

/* ------------------------------------------------------------------ */
/*  Scrap categories                                                   */
/* ------------------------------------------------------------------ */

type Category = {
  id: string
  emoji: string
  rate: number // ₹ per kg
  color: string
  name: Record<Lang, string>
}

const CATEGORIES: Category[] = [
  {
    id: "pcb",
    emoji: "🔌",
    rate: 320,
    color: "bg-emerald-100 border-emerald-300",
    name: { hi: "पीसीबी / सर्किट", mr: "पीसीबी / सर्किट", en: "PCBs / Circuits" },
  },
  {
    id: "battery",
    emoji: "🔋",
    rate: 95,
    color: "bg-amber-100 border-amber-300",
    name: { hi: "बैटरी", mr: "बॅटरी", en: "Batteries" },
  },
  {
    id: "wires",
    emoji: "🧵",
    rate: 180,
    color: "bg-orange-100 border-orange-300",
    name: { hi: "तार / केबल", mr: "तार / केबल", en: "Wires / Cables" },
  },
  {
    id: "crt",
    emoji: "🖥️",
    rate: 45,
    color: "bg-sky-100 border-sky-300",
    name: { hi: "मॉनिटर / सीआरटी", mr: "मॉनिटर / सीआरटी", en: "CRT / Monitors" },
  },
  {
    id: "plastic",
    emoji: "♻️",
    rate: 22,
    color: "bg-violet-100 border-violet-300",
    name: { hi: "मिक्स प्लास्टिक", mr: "मिक्स प्लास्टिक", en: "Mixed Plastics" },
  },
]

/* ------------------------------------------------------------------ */
/*  Recyclers (mock)                                                   */
/* ------------------------------------------------------------------ */

type Recycler = {
  id: string
  name: string
  distance: number
  rateMultiplier: number
  verified: boolean
}

const RECYCLERS: Recycler[] = [
  { id: "r1", name: "GreenTech E-Recyclers", distance: 1.2, rateMultiplier: 1.05, verified: true },
  { id: "r2", name: "EcoScrap Solutions", distance: 2.8, rateMultiplier: 1.0, verified: true },
  { id: "r3", name: "Bharat Metal Works", distance: 4.5, rateMultiplier: 0.92, verified: false },
]

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Lot = {
  lotId: string
  categoryId: string
  weight: number
  payout: number
  recycler: string
  timestamp: string
  offline: boolean
}

type Screen = "dashboard" | "add" | "recyclers" | "receipt"

/* ------------------------------------------------------------------ */
/*  Speech helper                                                      */
/* ------------------------------------------------------------------ */

function speak(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = SPEECH_LOCALE[lang]
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-QR                                            */
/* ------------------------------------------------------------------ */

function qrCells(seed: string): boolean[] {
  const size = 21
  const cells: boolean[] = []
  let h = 2166136261
  for (let i = 0; i < size * size; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i
    h = Math.imul(h, 16777619)
    cells.push((h >>> 7) % 2 === 0)
  }
  return cells
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */

function ListenButton({ text, lang }: { text: string; lang: Lang }) {
  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      aria-label={tr("listenGuide", lang)}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm active:scale-95 transition-transform"
    >
      <Volume2 className="h-5 w-5" />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [lang, setLang] = useState<Lang>("hi")
  const [offline, setOffline] = useState(false)
  const [screen, setScreen] = useState<Screen>("dashboard")

  const [lots, setLots] = useState<Lot[]>([])

  // add-lot flow state
  const [catId, setCatId] = useState<string | null>(null)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [weight, setWeight] = useState(5)
  const [recyclerId, setRecyclerId] = useState<string | null>(null)
  const [activeReceipt, setActiveReceipt] = useState<Lot | null>(null)

  const category = useMemo(() => CATEGORIES.find((c) => c.id === catId) ?? null, [catId])
  const recycler = useMemo(() => RECYCLERS.find((r) => r.id === recyclerId) ?? null, [recyclerId])

  const basePayout = useMemo(() => (category ? Math.round(category.rate * weight) : 0), [category, weight])
  const finalPayout = useMemo(
    () => (category && recycler ? Math.round(category.rate * weight * recycler.rateMultiplier) : basePayout),
    [category, recycler, weight, basePayout],
  )

  const resetFlow = useCallback(() => {
    setCatId(null)
    setHasPhoto(false)
    setWeight(5)
    setRecyclerId(null)
  }, [])

  const startAdd = useCallback(() => {
    resetFlow()
    setScreen("add")
  }, [resetFlow])

  const acceptOffer = useCallback(
    (r: Recycler) => {
      if (!category) return
      const lot: Lot = {
        lotId: "KW-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        categoryId: category.id,
        weight,
        payout: Math.round(category.rate * weight * r.rateMultiplier),
        recycler: r.name,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        offline,
      }
      setLots((prev) => [lot, ...prev])
      setActiveReceipt(lot)
      setScreen("receipt")
    },
    [category, weight, offline],
  )

  return (
    <div className="min-h-screen w-full bg-neutral-200 flex justify-center">
      {/* Phone frame */}
      <div className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-neutral-50 shadow-xl">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-emerald-700 px-4 pt-4 pb-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Recycle className="h-5 w-5" />
              </div>
              <h1 className="text-base font-bold leading-tight">{tr("appName", lang)}</h1>
            </div>
            <ListenButton text={tr("appName", lang)} lang={lang} />
          </div>

          {/* Language toggle */}
          <div className="mt-3 flex items-center gap-1 rounded-xl bg-white/15 p-1">
            <Languages className="ml-1 h-4 w-4 opacity-80" />
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-colors ${
                  lang === l.code ? "bg-white text-emerald-700" : "text-white/90"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Offline toggle */}
          <button
            type="button"
            onClick={() => setOffline((o) => !o)}
            className="mt-2 flex w-full items-center justify-between rounded-xl bg-white/15 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              {"Simulate " + tr("offline", lang)}
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${offline ? "bg-amber-400" : "bg-white/30"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  offline ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
        </header>

        {/* Offline banner */}
        {offline && (
          <div className="flex items-center gap-2 bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950">
            <WifiOff className="h-4 w-4 shrink-0" />
            {tr("offlineBanner", lang)}
          </div>
        )}

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          {screen === "dashboard" && (
            <Dashboard
              lang={lang}
              lots={lots}
              onAdd={startAdd}
              onOpenReceipt={(lot) => {
                setActiveReceipt(lot)
                setScreen("receipt")
              }}
            />
          )}

          {screen === "add" && (
            <AddLot
              lang={lang}
              catId={catId}
              setCatId={setCatId}
              hasPhoto={hasPhoto}
              setHasPhoto={setHasPhoto}
              weight={weight}
              setWeight={setWeight}
              payout={basePayout}
              onBack={() => setScreen("dashboard")}
              onNext={() => setScreen("recyclers")}
            />
          )}

          {screen === "recyclers" && category && (
            <Recyclers
              lang={lang}
              category={category}
              weight={weight}
              recyclerId={recyclerId}
              setRecyclerId={setRecyclerId}
              onBack={() => setScreen("add")}
              onAccept={acceptOffer}
            />
          )}

          {screen === "receipt" && activeReceipt && (
            <Receipt
              lang={lang}
              lot={activeReceipt}
              onHome={() => {
                resetFlow()
                setScreen("dashboard")
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 1: Dashboard                                                */
/* ------------------------------------------------------------------ */

function Dashboard({
  lang,
  lots,
  onAdd,
  onOpenReceipt,
}: {
  lang: Lang
  lots: Lot[]
  onAdd: () => void
  onOpenReceipt: (lot: Lot) => void
}) {
  return (
    <div className="space-y-5">
      {/* Rates */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">{tr("todayRates", lang)}</h2>
          <ListenButton text={tr("todayRates", lang)} lang={lang} />
        </div>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 rounded-2xl border-2 ${c.color} px-3 py-2.5`}
            >
              <span className="text-2xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="flex-1 font-semibold text-neutral-800">{c.name[lang]}</span>
              <span className="text-lg font-extrabold text-emerald-700">₹{c.rate}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Add lot CTA */}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
      >
        <Plus className="h-6 w-6" />
        {tr("addLot", lang)}
      </button>

      {/* Existing lots */}
      <section>
        <h2 className="mb-2 text-lg font-bold text-neutral-800">{tr("yourLots", lang)}</h2>
        {lots.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 py-8 text-neutral-400">
            <Package className="h-8 w-8" />
            <span className="text-sm font-medium">{tr("noLots", lang)}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {lots.map((lot) => {
              const c = CATEGORIES.find((x) => x.id === lot.categoryId)
              return (
                <button
                  key={lot.lotId}
                  type="button"
                  onClick={() => onOpenReceipt(lot)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-left shadow-sm active:scale-[0.99] transition-transform"
                >
                  <span className="text-2xl" aria-hidden>
                    {c?.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-800">{c?.name[lang]}</p>
                    <p className="text-xs text-neutral-500">
                      {lot.lotId} · {lot.weight} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-700">₹{lot.payout}</p>
                    {lot.offline && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                        <WifiOff className="h-3 w-3" /> sync
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 2: Add Scrap Lot                                            */
/* ------------------------------------------------------------------ */

function AddLot({
  lang,
  catId,
  setCatId,
  hasPhoto,
  setHasPhoto,
  weight,
  setWeight,
  payout,
  onBack,
  onNext,
}: {
  lang: Lang
  catId: string | null
  setCatId: (v: string) => void
  hasPhoto: boolean
  setHasPhoto: (v: boolean) => void
  weight: number
  setWeight: (v: number) => void
  payout: number
  onBack: () => void
  onNext: () => void
}) {
  const canProceed = !!catId && hasPhoto && weight > 0

  return (
    <div className="space-y-5">
      <ScreenHeader lang={lang} title={tr("addLot", lang)} onBack={onBack} listenText={tr("selectCategory", lang)} />

      {/* Category grid */}
      <section>
        <h3 className="mb-2 font-bold text-neutral-700">{tr("selectCategory", lang)}</h3>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => {
            const active = c.id === catId
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCatId(c.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                  active ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200" : `${c.color}`
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {c.emoji}
                </span>
                <span className="text-center text-sm font-semibold leading-tight text-neutral-800">
                  {c.name[lang]}
                </span>
                <span className="text-xs font-bold text-emerald-700">₹{c.rate}/kg</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Photo */}
      <section>
        <button
          type="button"
          onClick={() => setHasPhoto(true)}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-6 transition-colors ${
            hasPhoto ? "border-emerald-500 bg-emerald-50" : "border-neutral-300 bg-white"
          }`}
        >
          {hasPhoto ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{tr("photoAdded", lang)}</span>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8 text-neutral-500" />
              <span className="font-semibold text-neutral-600">{tr("addPhoto", lang)}</span>
            </>
          )}
        </button>
      </section>

      {/* Weight stepper */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-neutral-700">{tr("weight", lang)}</h3>
          <ListenButton text={tr("weight", lang)} lang={lang} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-2">
          <button
            type="button"
            onClick={() => setWeight(Math.max(1, weight - 1))}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500 text-white active:scale-95 transition-transform"
            aria-label="minus"
          >
            <Minus className="h-7 w-7" />
          </button>
          <div className="text-center">
            <span className="text-4xl font-extrabold text-neutral-800">{weight}</span>
            <span className="ml-1 text-lg font-semibold text-neutral-500">kg</span>
          </div>
          <button
            type="button"
            onClick={() => setWeight(weight + 1)}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 text-white active:scale-95 transition-transform"
            aria-label="plus"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>
      </section>

      {/* Estimated payout */}
      <section className="rounded-2xl bg-emerald-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{tr("estPayout", lang)}</p>
            <p className="text-3xl font-extrabold">₹{payout}</p>
          </div>
          <ListenButton text={`${tr("estPayout", lang)} ${payout} ₹`} lang={lang} />
        </div>
      </section>

      <button
        type="button"
        disabled={!canProceed}
        onClick={onNext}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none"
      >
        {tr("findRecycler", lang)}
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 3: Find Recycler                                            */
/* ------------------------------------------------------------------ */

function Recyclers({
  lang,
  category,
  weight,
  recyclerId,
  setRecyclerId,
  onBack,
  onAccept,
}: {
  lang: Lang
  category: Category
  weight: number
  recyclerId: string | null
  setRecyclerId: (v: string) => void
  onBack: () => void
  onAccept: (r: Recycler) => void
}) {
  return (
    <div className="space-y-4">
      <ScreenHeader lang={lang} title={tr("nearbyRecyclers", lang)} onBack={onBack} listenText={tr("nearbyRecyclers", lang)} />

      <div className="space-y-3">
        {RECYCLERS.map((r) => {
          const offer = Math.round(category.rate * weight * r.rateMultiplier)
          const selected = r.id === recyclerId
          return (
            <div
              key={r.id}
              className={`rounded-2xl border-2 bg-white p-4 shadow-sm transition-all ${
                selected ? "border-emerald-600 ring-2 ring-emerald-200" : "border-neutral-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-neutral-800">{r.name}</h3>
                    {r.verified && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {r.distance} {tr("km", lang)}
                    </span>
                    {r.verified && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                        {tr("verified", lang)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">{tr("offers", lang)}</p>
                  <p className="text-2xl font-extrabold text-emerald-700">₹{offer}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRecyclerId(r.id)
                  onAccept(r)
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white active:scale-[0.98] transition-transform"
              >
                <Check className="h-5 w-5" />
                {tr("acceptOffer", lang)}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 4: Receipt                                                  */
/* ------------------------------------------------------------------ */

function Receipt({ lang, lot, onHome }: { lang: Lang; lot: Lot; onHome: () => void }) {
  const cells = useMemo(() => qrCells(lot.lotId), [lot.lotId])
  const cat = CATEGORIES.find((c) => c.id === lot.categoryId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 pt-2">
        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        <h2 className="text-xl font-bold text-neutral-800">{tr("receipt", lang)}</h2>
        <ListenButton text={tr("receipt", lang)} lang={lang} />
      </div>

      {/* QR card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mx-auto grid w-[168px] grid-cols-[repeat(21,1fr)] overflow-hidden rounded-lg border-4 border-neutral-900">
          {cells.map((on, i) => (
            <span key={i} className={`aspect-square ${on ? "bg-neutral-900" : "bg-white"}`} />
          ))}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <Row label={tr("lotId", lang)} value={lot.lotId} strong />
          <Row label={tr("selectCategory", lang)} value={`${cat?.emoji ?? ""} ${cat?.name[lang] ?? ""}`} />
          <Row label={tr("weight", lang)} value={`${lot.weight} kg`} />
          <Row
            label={tr("time", lang)}
            value={lot.timestamp}
            icon={<Clock className="h-3.5 w-3.5 text-neutral-400" />}
          />
          <Row label={tr("findRecycler", lang)} value={lot.recycler} />
          <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-2">
            <span className="font-semibold text-neutral-600">{tr("payout", lang)}</span>
            <span className="text-2xl font-extrabold text-emerald-700">₹{lot.payout}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`flex items-center gap-3 rounded-2xl p-4 ${
          lot.offline ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"
        }`}
      >
        {lot.offline ? <WifiOff className="h-5 w-5 shrink-0" /> : <Clock className="h-5 w-5 shrink-0" />}
        <div className="flex-1">
          <p className="text-xs font-medium opacity-80">{tr("status", lang)}</p>
          <p className="font-bold">{lot.offline ? tr("savedOffline", lang) : tr("pending", lang)}</p>
        </div>
        <ListenButton text={lot.offline ? tr("savedOffline", lang) : tr("pending", lang)} lang={lang} />
      </div>

      <button
        type="button"
        onClick={onHome}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-800 py-4 text-lg font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
      >
        <Home className="h-5 w-5" />
        {tr("backHome", lang)}
      </button>
    </div>
  )
}

function Row({
  label,
  value,
  strong,
  icon,
}: {
  label: string
  value: string
  strong?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-neutral-500">{label}</span>
      <span className={`flex items-center gap-1 text-right ${strong ? "font-extrabold text-neutral-900" : "font-medium text-neutral-700"}`}>
        {icon}
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared screen header                                               */
/* ------------------------------------------------------------------ */

function ScreenHeader({
  lang,
  title,
  onBack,
  listenText,
}: {
  lang: Lang
  title: string
  onBack: () => void
  listenText: string
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="back"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 active:scale-95 transition-transform"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="flex-1 text-xl font-bold text-neutral-800">{title}</h2>
      <ListenButton text={listenText} lang={lang} />
    </div>
  )
}
