import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import { useCoursesContext } from "../context/courses_context";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/cart_context";
import { Oval } from "react-loader-spinner";
import parse from "html-react-parser";

const PricingOption = ({ pricing, checked, onToggle }) => (
  <label
    className={`group flex items-start gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-all duration-200 ${
      checked
        ? "border-[#184e77] bg-[#184e77]/[0.06] shadow-sm"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked
          ? "border-[#184e77] bg-[#184e77] text-white"
          : "border-slate-300 bg-white text-transparent group-hover:border-slate-400"
      }`}
    >
      <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onToggle}
    />
    <span className="flex flex-1 items-start justify-between gap-3">
      <span
        className={`text-sm leading-snug ${
          checked ? "font-medium text-slate-900" : "text-slate-700"
        }`}
      >
        {pricing.sessionType}
      </span>
      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${
          checked ? "text-[#184e77]" : "text-slate-800"
        }`}
      >
        ${pricing.price}
      </span>
    </span>
  </label>
);

const ContentSection = ({ title, children }) => (
  <section className="scroll-mt-24 border-b border-slate-100 py-8 last:border-b-0 last:pb-2">
    <div className="mb-4 flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-[#184e77]" />
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
        {title}
      </h2>
    </div>
    <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-slate-600 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
      {children}
    </div>
  </section>
);

const PriceBlock = ({ totalPrice, selectedCount }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d3a5c] via-[#184e77] to-[#1a6a9a] p-5 text-white shadow-lg">
    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
    <div className="pointer-events-none absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-sky-300/15" />
    <p className="text-xs font-medium uppercase tracking-[0.14em] text-sky-100/80">
      Your total
    </p>
    <div className="mt-2 flex items-end gap-3">
      <p className="text-4xl font-bold tracking-tight tabular-nums">
        $
        {totalPrice != null && totalPrice > 0 ? totalPrice.toFixed(2) : "00.00"}
      </p>
      <p className="mb-1.5 text-sm text-orange-200 line-through tabular-nums">
        Was: $
        {totalPrice != null && totalPrice > 0
          ? (totalPrice + selectedCount * 49).toFixed(2)
          : "00.00"}
      </p>
    </div>
    <p className="mt-2 inline-flex items-center rounded-md bg-emerald-400/20 px-2.5 py-1 text-xs font-medium text-emerald-100 ring-1 ring-inset ring-emerald-300/30">
      You save ${selectedCount * 49}
    </p>
  </div>
);

const AddToCartButton = ({
  selectedPricings,
  courseID,
  imageSrc,
  title,
  instructor,
  totalPrice,
  discountedPrice,
  addToCart,
}) => (
  <Link
    to={selectedPricings.length === 0 ? "#" : "/cart"}
    className={`flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-200 ${
      selectedPricings.length === 0
        ? "cursor-not-allowed bg-slate-300 pointer-events-none shadow-none"
        : "bg-[#184e77] hover:bg-[#123a5a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#184e77]/40 focus:ring-offset-2"
    }`}
    onClick={(e) => {
      if (selectedPricings.length === 0) {
        e.preventDefault();
        return;
      }
      addToCart(
        courseID,
        imageSrc,
        title,
        instructor,
        selectedPricings.length > 0 ? totalPrice : discountedPrice,
        selectedPricings,
      );
    }}
  >
    Add to Cart
  </Link>
);

const SingleTrainingDetail = () => {
  const { id } = useParams();
  const { fetchSingleCourse, single_course } = useCoursesContext();
  const { addToCart } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [selectedPricings, setSelectedPricings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSingleCourse(id);
      setLoading(false);
    };
    fetchData();
  }, [id, fetchSingleCourse]);

  useEffect(() => {
    if (single_course?.Pricings?.length) {
      const isPastWebinar = new Date(single_course.webinarDate) < new Date();

      if (isPastWebinar) {
        const accessOptions = single_course.Pricings.filter(
          (pricing) =>
            pricing.sessionType === "Recorded session" ||
            pricing.sessionType === "Transcript" ||
            pricing.sessionType === "Recorded Plus Transcript session",
        );

        if (accessOptions.length > 0) {
          setSelectedPricings([accessOptions[0]]);
        }
      } else {
        setSelectedPricings([single_course.Pricings[0]]);
      }
    }
  }, [single_course]);

  const handlePricingToggle = (pricing) => {
    setSelectedPricings((prev) => {
      const exists = prev.find((p) => p.id === pricing.id);

      if (exists) {
        return prev.filter((p) => p.id !== pricing.id);
      } else {
        return [...prev, pricing];
      }
    });
  };

  const totalPrice = selectedPricings.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0,
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Oval
          height={50}
          width={50}
          color="#184e77"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#7eb8d4"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  const {
    courseID,
    title,
    instructor,
    discountedPrice,
    description,
    what_you_will_learn,
    imageSrc,
    Pricings = [],
    webinarDate,
    duration,
    areas_covered,
    who_will_benefit,
    instructor_profile,
    why_register,
    background,
  } = single_course;

  const dateTime = new Date(webinarDate);
  const webinarDateUTC = new Date(webinarDate);
  const isPastWebinar = new Date(webinarDate) < new Date();
  const accessOptions = Pricings.filter(
    (pricing) =>
      pricing.sessionType === "Recorded session" ||
      pricing.sessionType === "Transcript" ||
      pricing.sessionType === "Recorded Plus Transcript session",
  );

  const day = webinarDateUTC.getUTCDate();
  const monthYear = webinarDateUTC.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const weekday = webinarDateUTC.toLocaleString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const formattedTimeEST = dateTime.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedTimePST = dateTime.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  function convertMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (minutes <= 60) {
      return `${minutes} min`;
    }

    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
  }

  const visiblePricings = showMore
    ? Pricings.slice(0, 5)
    : Pricings.slice(0, 2);

  const cartProps = {
    selectedPricings,
    courseID,
    imageSrc,
    title,
    instructor,
    totalPrice,
    discountedPrice,
    addToCart,
  };

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden bg-[#eef3f8]">
        {/* Unique page background */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Soft color wash */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_0%,#c5dded_0%,transparent_55%),radial-gradient(ellipse_90%_70%_at_100%_10%,#b8d4e8_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_50%_100%,#d9e8f2_0%,#eef3f8_70%)]" />

          {/* Diagonal light beams */}
          <div className="absolute -left-1/4 top-0 h-[70%] w-[55%] rotate-[-18deg] bg-gradient-to-r from-[#184e77]/[0.07] via-[#7eb8d4]/10 to-transparent blur-2xl" />
          <div className="absolute right-[-10%] top-24 h-[50%] w-[40%] rotate-[22deg] bg-gradient-to-l from-[#2a7ab0]/12 via-transparent to-transparent blur-2xl" />

          {/* Flowing ribbon + constellation SVG */}
          <svg
            className="absolute inset-x-0 top-0 h-[620px] w-full"
            viewBox="0 0 1440 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin slice"
          >
            <path
              d="M-40 180C180 80 320 260 520 200C720 140 820 40 1020 90C1220 140 1340 220 1480 160V0H-40V180Z"
              fill="url(#wbRibbonA)"
              opacity="0.6"
            />
            <path
              d="M-40 280C160 200 300 340 540 280C780 220 900 120 1120 170C1280 205 1380 260 1480 230V80C1320 140 1180 60 980 100C760 150 640 260 420 220C220 185 80 120 -40 160V280Z"
              fill="url(#wbRibbonB)"
              opacity="0.45"
            />
            <path
              d="M-40 360C200 300 360 420 600 360C840 300 980 220 1220 270C1360 300 1440 340 1500 320V200C1380 250 1260 180 1040 210C800 250 660 360 420 320C220 285 60 240 -40 270V360Z"
              fill="url(#wbRibbonC)"
              opacity="0.28"
            />
            <path
              d="M-20 420C200 340 380 460 620 400C860 340 980 260 1200 300C1340 325 1420 360 1480 340"
              stroke="#184e77"
              strokeOpacity="0.14"
              strokeWidth="1.5"
            />
            <path
              d="M-20 455C220 380 400 500 660 440C900 385 1040 310 1260 345"
              stroke="#2a7ab0"
              strokeOpacity="0.12"
              strokeWidth="1.25"
            />
            <path
              d="M80 520C260 470 420 560 680 500C900 450 1080 400 1320 450"
              stroke="#184e77"
              strokeOpacity="0.08"
              strokeWidth="1"
              strokeDasharray="6 10"
            />

            {/* Connected nodes constellation */}
            <g stroke="#184e77" strokeOpacity="0.14" strokeWidth="1">
              <line x1="180" y1="140" x2="260" y2="100" />
              <line x1="260" y1="100" x2="320" y2="150" />
              <line x1="320" y1="150" x2="390" y2="120" />
              <line x1="1180" y1="180" x2="1260" y2="140" />
              <line x1="1260" y1="140" x2="1340" y2="190" />
              <line x1="1260" y1="140" x2="1300" y2="90" />
            </g>
            <g fill="#184e77">
              <circle cx="180" cy="140" r="3.5" fillOpacity="0.28" />
              <circle cx="260" cy="100" r="4.5" fillOpacity="0.35" />
              <circle cx="320" cy="150" r="3" fillOpacity="0.22" />
              <circle cx="390" cy="120" r="3.5" fillOpacity="0.28" />
              <circle cx="1180" cy="180" r="3" fillOpacity="0.22" />
              <circle cx="1260" cy="140" r="5" fillOpacity="0.32" />
              <circle cx="1340" cy="190" r="3" fillOpacity="0.2" />
              <circle cx="1300" cy="90" r="3.5" fillOpacity="0.26" />
            </g>

            {/* Floating geometric accents */}
            <rect
              x="90"
              y="300"
              width="18"
              height="18"
              rx="3"
              transform="rotate(28 99 309)"
              stroke="#184e77"
              strokeOpacity="0.18"
              fill="#7eb8d4"
              fillOpacity="0.12"
            />
            <rect
              x="1320"
              y="300"
              width="22"
              height="22"
              rx="4"
              transform="rotate(-20 1331 311)"
              stroke="#2a7ab0"
              strokeOpacity="0.2"
              fill="#184e77"
              fillOpacity="0.08"
            />
            <polygon
              points="700,90 716,118 684,118"
              fill="#184e77"
              fillOpacity="0.12"
            />
            <circle
              cx="760"
              cy="500"
              r="26"
              stroke="#184e77"
              strokeOpacity="0.1"
              fill="none"
            />
            <circle cx="760" cy="500" r="8" fill="#7eb8d4" fillOpacity="0.25" />

            <defs>
              <linearGradient
                id="wbRibbonA"
                x1="0"
                y1="0"
                x2="1440"
                y2="320"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#184e77" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#4fa3c8" stopOpacity="0.16" />
                <stop offset="1" stopColor="#184e77" stopOpacity="0.09" />
              </linearGradient>
              <linearGradient
                id="wbRibbonB"
                x1="200"
                y1="80"
                x2="1200"
                y2="360"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7eb8d4" stopOpacity="0.38" />
                <stop offset="1" stopColor="#184e77" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient
                id="wbRibbonC"
                x1="0"
                y1="220"
                x2="1440"
                y2="400"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2a7ab0" stopOpacity="0.18" />
                <stop offset="1" stopColor="#184e77" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          {/* Left arc stack */}
          <div className="absolute -left-40 top-48 h-[380px] w-[380px] rounded-full border border-[#184e77]/10" />
          <div className="absolute -left-24 top-64 h-[260px] w-[260px] rounded-full border border-[#2a7ab0]/12" />
          <div className="absolute left-8 top-[19.5rem] h-[140px] w-[140px] rounded-full border border-dashed border-[#184e77]/15" />

          {/* Orbit rings */}
          <div className="absolute -right-28 top-16 h-[420px] w-[420px] rounded-full border border-[#184e77]/12" />
          <div className="absolute -right-12 top-32 h-[300px] w-[300px] rounded-full border border-[#184e77]/[0.08]" />
          <div className="absolute right-16 top-48 h-[180px] w-[180px] rounded-full border border-[#2a7ab0]/18" />
          <div className="absolute right-28 top-60 h-[90px] w-[90px] rounded-full bg-gradient-to-br from-[#7eb8d4]/20 to-transparent" />
          <div className="absolute right-[7.5rem] top-[14.5rem] h-3 w-3 rounded-full bg-[#184e77]/30 shadow-[0_0_12px_rgba(24,78,119,0.35)]" />

          {/* Soft diamond lattice */}
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 2L54 28L28 54L2 28Z' fill='none' stroke='%23184e77' stroke-opacity='0.35' stroke-width='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: "56px 56px",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 72%)",
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 72%)",
            }}
          />

          {/* Scattered accent dots */}
          <div className="absolute left-[12%] top-[58%] h-2 w-2 rounded-full bg-[#184e77]/20" />
          <div className="absolute left-[22%] top-[72%] h-1.5 w-1.5 rounded-full bg-[#2a7ab0]/25" />
          <div className="absolute left-[8%] top-[80%] h-2.5 w-2.5 rounded-full bg-[#7eb8d4]/30" />
          <div className="absolute right-[18%] top-[62%] h-2 w-2 rounded-full bg-[#184e77]/18" />
          <div className="absolute right-[28%] top-[78%] h-1.5 w-1.5 rounded-full bg-[#2a7ab0]/22" />

          {/* Bottom wave fade */}
          <svg
            className="absolute inset-x-0 bottom-0 h-40 w-full"
            viewBox="0 0 1440 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80C240 20 480 140 720 80C960 20 1200 120 1440 60V160H0V80Z"
              fill="url(#wbBottomWave)"
            />
            <defs>
              <linearGradient
                id="wbBottomWave"
                x1="720"
                y1="0"
                x2="720"
                y2="160"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7eb8d4" stopOpacity="0.18" />
                <stop offset="1" stopColor="#eef3f8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Bottom glow accent */}
          <div className="absolute -bottom-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-[#7eb8d4]/30 blur-3xl" />
        </div>

        {/* Hero — instructor / date / duration panel */}
        <div className="relative mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_20px_60px_-20px_rgba(12,45,74,0.45)]">
            {/* Designed panel background */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#0b2f4a] via-[#184e77] to-[#1f6f9f]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 20%, rgba(126,184,212,0.45) 0%, transparent 35%), radial-gradient(circle at 88% 15%, rgba(255,255,255,0.14) 0%, transparent 28%), radial-gradient(circle at 70% 85%, rgba(42,122,176,0.5) 0%, transparent 40%)",
              }}
            />
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1200 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 280C180 220 320 340 520 290C720 240 860 150 1060 190C1140 205 1180 230 1200 245V420H0V280Z"
                fill="url(#heroWave)"
              />
              <path
                d="M-20 120C140 70 260 160 420 120C600 75 720 20 900 55C1040 80 1120 120 1220 100"
                stroke="white"
                strokeOpacity="0.12"
                strokeWidth="1.5"
              />
              <path
                d="M40 170C200 130 300 210 460 170C640 125 780 70 960 110"
                stroke="white"
                strokeOpacity="0.08"
                strokeWidth="1.25"
                strokeDasharray="5 9"
              />
              <circle
                cx="980"
                cy="90"
                r="70"
                stroke="white"
                strokeOpacity="0.1"
              />
              <circle
                cx="980"
                cy="90"
                r="42"
                stroke="white"
                strokeOpacity="0.08"
              />
              <circle cx="980" cy="90" r="16" fill="white" fillOpacity="0.08" />
              <circle cx="160" cy="70" r="4" fill="white" fillOpacity="0.25" />
              <circle cx="210" cy="95" r="3" fill="white" fillOpacity="0.18" />
              <circle
                cx="1080"
                cy="200"
                r="3.5"
                fill="white"
                fillOpacity="0.2"
              />
              <defs>
                <linearGradient
                  id="heroWave"
                  x1="600"
                  y1="180"
                  x2="600"
                  y2="420"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7eb8d4" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#0b2f4a" stopOpacity="0.35" />
                </linearGradient>
              </defs>
            </svg>
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 1L39 20L20 39L1 20Z' fill='none' stroke='white' stroke-width='0.7'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
                maskImage:
                  "linear-gradient(120deg, transparent 10%, black 40%, black 70%, transparent 95%)",
                WebkitMaskImage:
                  "linear-gradient(120deg, transparent 10%, black 40%, black 70%, transparent 95%)",
              }}
            />

            <div className="relative px-5 py-7 sm:px-8 sm:py-9 md:px-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Instructor portrait */}
                <div className="mx-auto shrink-0 sm:mx-0">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-sky-200/40 via-transparent to-white/10 blur-md" />
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 shadow-xl ring-1 ring-white/20">
                      <img
                        src={imageSrc}
                        alt={instructor?.replace(/"/g, "") || title}
                        className="h-40 w-32 object-cover object-top sm:h-44 sm:w-36"
                      />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${
                        isPastWebinar
                          ? "bg-amber-400/20 text-amber-100 ring-1 ring-amber-200/40"
                          : "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-200/40"
                      }`}
                    >
                      {isPastWebinar ? "On-Demand Access" : "Live Webinar"}
                    </span>
                  </div>

                  <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                    {title}
                  </h1>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <CalendarDaysIcon className="h-5 w-5 text-sky-100" />
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-sky-100/70">
                          Date
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {weekday}, {day} {monthYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <ClockIcon className="h-5 w-5 text-sky-100" />
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-sky-100/70">
                          Time
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {formattedTimeEST} EST / {formattedTimePST} PST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <UserIcon className="h-5 w-5 text-sky-100" />
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-sky-100/70">
                          Instructor
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {instructor?.replace(/"/g, "")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md transition hover:bg-white/15">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                        <ClockIcon className="h-5 w-5 text-sky-100" />
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-sky-100/70">
                          Duration
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {duration ? convertMinutes(duration) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main content */}
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="px-5 py-2 sm:px-8">
                  {description ? (
                    <ContentSection title="Description">
                      {parse(description)}
                    </ContentSection>
                  ) : null}

                  {why_register ? (
                    <ContentSection title="Why Register">
                      {parse(why_register)}
                    </ContentSection>
                  ) : null}

                  {what_you_will_learn ? (
                    <ContentSection title="Why Should You Attend">
                      {parse(what_you_will_learn)}
                    </ContentSection>
                  ) : null}

                  {areas_covered ? (
                    <ContentSection title="Areas Covered in the Webinar Session">
                      {parse(areas_covered)}
                    </ContentSection>
                  ) : null}

                  {who_will_benefit ? (
                    <ContentSection title="Who will benefit?">
                      {parse(who_will_benefit)}
                    </ContentSection>
                  ) : null}

                  {instructor_profile ? (
                    <ContentSection title="Instructor Profile">
                      {parse(instructor_profile)}
                    </ContentSection>
                  ) : null}

                  {background ? (
                    <ContentSection title="Background">
                      {parse(background)}
                    </ContentSection>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Purchase sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-4">
                {isPastWebinar ? (
                  <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <PriceBlock
                      totalPrice={totalPrice}
                      selectedCount={selectedPricings.length}
                    />
                    <AddToCartButton {...cartProps} />

                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Access Options
                      </h3>
                      <div className="space-y-2">
                        {accessOptions.map((pricing) => {
                          const isChecked = selectedPricings.some(
                            (p) => p.id === pricing.id,
                          );
                          return (
                            <PricingOption
                              key={pricing.id}
                              pricing={pricing}
                              checked={isChecked}
                              onToggle={() => handlePricingToggle(pricing)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <PriceBlock
                      totalPrice={totalPrice}
                      selectedCount={selectedPricings.length}
                    />
                    <AddToCartButton {...cartProps} />

                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Live Webinar
                      </h3>
                      <div className="space-y-2">
                        {visiblePricings.map((pricing) => {
                          const isChecked = selectedPricings.some(
                            (p) => p.id === pricing.id,
                          );
                          return (
                            <PricingOption
                              key={pricing.id}
                              pricing={pricing}
                              checked={isChecked}
                              onToggle={() => handlePricingToggle(pricing)}
                            />
                          );
                        })}
                      </div>

                      {Pricings.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setShowMore(!showMore)}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#184e77] transition-colors hover:text-[#0d3a5c]"
                        >
                          <span>
                            {showMore ? "Less Attendees" : "More Attendees"}
                          </span>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform duration-200 ${
                              showMore ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        On-Demand
                      </h3>
                      <div className="space-y-2">
                        {Pricings?.filter(
                          (pricing) =>
                            pricing.sessionType === "Recorded session" ||
                            pricing.sessionType === "Transcript",
                        ).map((pricing) => {
                          const isChecked = selectedPricings.some(
                            (p) => p.id === pricing.id,
                          );
                          return (
                            <PricingOption
                              key={pricing.id}
                              pricing={pricing}
                              checked={isChecked}
                              onToggle={() => handlePricingToggle(pricing)}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Value Packs
                      </h3>
                      <div className="space-y-2">
                        {Pricings?.filter(
                          (pricing) =>
                            pricing.sessionType ===
                              "Live Plus Recorded session" ||
                            pricing.sessionType ===
                              "Live Plus Transcript session" ||
                            pricing.sessionType ===
                              "Recorded Plus Transcript session" ||
                            pricing.sessionType ===
                              "Group Session For 10 Attendees" ||
                            pricing.sessionType ===
                              "Group Session For More Than 10 Attendees",
                        ).map((pricing) => {
                          const isChecked = selectedPricings.some(
                            (p) => p.id === pricing.id,
                          );
                          return (
                            <PricingOption
                              key={pricing.id}
                              pricing={pricing}
                              checked={isChecked}
                              onToggle={() => handlePricingToggle(pricing)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleTrainingDetail;
