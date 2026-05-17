"use client";

import {
  AlarmClock,
  ArrowRightLeft,
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Star,
  TimerReset
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type City = {
  city: string;
  country: string;
  zone: string;
  offset: string;
};

const cities: City[] = [
  { city: "New York", country: "United States", zone: "America/New_York", offset: "UTC-4" },
  { city: "London", country: "United Kingdom", zone: "Europe/London", offset: "UTC+1" },
  { city: "Tokyo", country: "Japan", zone: "Asia/Tokyo", offset: "UTC+9" },
  { city: "Dubai", country: "United Arab Emirates", zone: "Asia/Dubai", offset: "UTC+4" },
  { city: "Sydney", country: "Australia", zone: "Australia/Sydney", offset: "UTC+10" },
  { city: "Los Angeles", country: "United States", zone: "America/Los_Angeles", offset: "UTC-7" },
  { city: "Paris", country: "France", zone: "Europe/Paris", offset: "UTC+2" },
  { city: "Singapore", country: "Singapore", zone: "Asia/Singapore", offset: "UTC+8" }
];

const navItems = [
  { label: "World Clock", href: "/#world-clock" },
  { label: "Converter", href: "/#converter" },
  { label: "Timers", href: "/#timers" },
  { label: "Cities", href: "/#cities" },
  { label: "FAQ", href: "/faq" }
];

function formatTime(date: Date, zone: string, includeSeconds = true) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: true,
    timeZone: zone
  }).format(date);
}

function formatDate(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: zone
  }).format(date);
}

function formatMainClock(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone
  }).format(date);
}

function getTimeZoneAbbreviation(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "short"
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? zone;
}

function dateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function getZonedParts(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour") === 24 ? 0 : value("hour"),
    minute: value("minute")
  };
}

function zonedWallTimeToInstant(input: string, zone: string) {
  const [datePart, timePart = "00:00"] = input.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = new Date(targetUtc);

  for (let index = 0; index < 3; index += 1) {
    const parts = getZonedParts(guess, zone);
    const representedUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute
    );
    guess = new Date(guess.getTime() - (representedUtc - targetUtc));
  }

  return guess;
}

function convertBetweenZones(input: string, fromZone: string, toZone: string) {
  const sourceDate = input ? zonedWallTimeToInstant(input, fromZone) : new Date();
  return formatTime(sourceDate, toZone, false);
}

export function ClockDashboard() {
  const [now, setNow] = useState(new Date());
  const [activeCity, setActiveCity] = useState(cities[0]);
  const [fromCity, setFromCity] = useState(cities[0]);
  const [toCity, setToCity] = useState(cities[1]);
  const [converterTime, setConverterTime] = useState(dateTimeLocal(new Date()));
  const [countdownSeconds, setCountdownSeconds] = useState(300);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!countdownRunning) return;
    const interval = window.setInterval(() => {
      setCountdownSeconds((value) => {
        if (value <= 1) {
          setCountdownRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [countdownRunning]);

  useEffect(() => {
    if (!stopwatchRunning) return;
    const interval = window.setInterval(() => {
      setStopwatchSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!pomodoroRunning) return;
    const interval = window.setInterval(() => {
      setPomodoroSeconds((value) => {
        if (value <= 1) {
          setPomodoroRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [pomodoroRunning]);

  const convertedTime = useMemo(
    () => convertBetweenZones(converterTime, fromCity.zone, toCity.zone),
    [converterTime, fromCity.zone, toCity.zone]
  );

  const mainClock = formatMainClock(now, activeCity.zone);

  return (
    <main>
      <Header />

      <section className="hero-shell" id="world-clock" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">Current time, anywhere</p>
          <h1 id="home-heading">World Clock, Time Zone Converter and Time Tools</h1>
          <p>
            Compare cities, plan meetings, run countdowns, and stay focused with a fast
            clock built for daily use.
          </p>
        </div>

        <div className="tool-grid">
          <section className="panel clock-panel" aria-label="World clock">
            <div className="panel-top">
              <div>
                <p className="label">Current time</p>
                <select
                  className="city-select"
                  value={activeCity.zone}
                  onChange={(event) => {
                    const selected = cities.find((city) => city.zone === event.target.value);
                    if (selected) setActiveCity(selected);
                  }}
                  aria-label="Choose city"
                >
                  {cities.map((city) => (
                    <option key={city.zone} value={city.zone}>
                      {city.city}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="icon-actions">
                <button type="button" aria-label="Favorite city">
                  <Star size={18} />
                </button>
                <button type="button" aria-label="Share time">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="time-display">{mainClock}</div>
            <p className="date-line">{formatDate(now, activeCity.zone)}</p>

            <div className="status-row">
              <span>{activeCity.offset}</span>
              <span>{getTimeZoneAbbreviation(now, activeCity.zone)}</span>
              <span className="positive">
                <CheckCircle2 size={15} /> DST active
              </span>
            </div>
          </section>

          <section
            className="panel converter-panel"
            id="converter"
            aria-labelledby="converter-heading"
          >
            <div className="panel-top">
              <div>
                <p className="label">Plan across cities</p>
                <h2 id="converter-heading">Time Zone Converter</h2>
              </div>
              <button
                className="round-action"
                type="button"
                aria-label="Swap time zones"
                onClick={() => {
                  setFromCity(toCity);
                  setToCity(fromCity);
                }}
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>

            <div className="field-stack">
              <label>
                <span>From</span>
                <select
                  value={fromCity.zone}
                  onChange={(event) => {
                    const selected = cities.find((city) => city.zone === event.target.value);
                    if (selected) setFromCity(selected);
                  }}
                >
                  {cities.map((city) => (
                    <option key={city.zone} value={city.zone}>
                      {city.city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>To</span>
                <select
                  value={toCity.zone}
                  onChange={(event) => {
                    const selected = cities.find((city) => city.zone === event.target.value);
                    if (selected) setToCity(selected);
                  }}
                >
                  {cities.map((city) => (
                    <option key={city.zone} value={city.zone}>
                      {city.city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Date and time</span>
                <input
                  type="datetime-local"
                  value={converterTime}
                  onChange={(event) => setConverterTime(event.target.value)}
                />
              </label>
            </div>

            <div className="result-card">
              <span>Converted result</span>
              <strong>
                {toCity.city}: {convertedTime}
              </strong>
            </div>

            <button className="primary-button" type="button">
              <Copy size={17} /> Copy result
            </button>
          </section>
        </div>
      </section>

      <section className="content-section" id="cities" aria-labelledby="cities-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Popular clocks</p>
            <h2 id="cities-heading">Check the Current Time Anywhere</h2>
          </div>
          <button className="secondary-button" type="button">
            <Plus size={17} /> Add City
          </button>
        </div>
        <div className="city-grid">
          {cities.slice(1, 7).map((city) => (
            <article className="city-card" key={city.zone}>
              <div>
                <h3>{city.city}</h3>
                <p>{city.country}</p>
              </div>
              <strong>{formatTime(now, city.zone, false)}</strong>
              <span>
                <Moon size={15} /> {city.offset}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-slot" aria-label="Advertisement">
        Advertisement
      </section>

      <section className="content-section" id="timers" aria-labelledby="timers-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Focus and timing</p>
            <h2 id="timers-heading">Countdown, Stopwatch and Pomodoro Timers</h2>
          </div>
        </div>

        <div className="timer-grid">
          <TimerCard
            icon={<Bell size={22} />}
            title="Countdown"
            value={formatDuration(countdownSeconds)}
            accent="orange"
            running={countdownRunning}
            onToggle={() => setCountdownRunning((value) => !value)}
            onReset={() => {
              setCountdownRunning(false);
              setCountdownSeconds(300);
            }}
          />
          <TimerCard
            icon={<TimerReset size={22} />}
            title="Stopwatch"
            value={formatDuration(stopwatchSeconds)}
            accent="blue"
            running={stopwatchRunning}
            onToggle={() => setStopwatchRunning((value) => !value)}
            onReset={() => {
              setStopwatchRunning(false);
              setStopwatchSeconds(0);
            }}
          />
          <TimerCard
            icon={<AlarmClock size={22} />}
            title="Pomodoro"
            value={formatDuration(pomodoroSeconds)}
            accent="red"
            running={pomodoroRunning}
            onToggle={() => setPomodoroRunning((value) => !value)}
            onReset={() => {
              setPomodoroRunning(false);
              setPomodoroSeconds(25 * 60);
            }}
          />
        </div>
      </section>

      <section className="content-section seo-section" aria-labelledby="seo-heading">
        <p className="eyebrow">Simple. Fast. Global.</p>
        <h2 id="seo-heading">Convert Time Zones for Meetings and Travel</h2>
        <p>
          World On Time helps remote teams, travelers, students, and families compare
          local times without clutter. Save favorite cities, check popular world clocks,
          convert meeting times, and use built-in timers from one clean homepage.
        </p>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="World On Time home">
        <span>
          <Clock3 size={19} />
        </span>
        World On Time
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button type="button" aria-label="Search">
          <Search size={18} />
        </button>
        <button type="button" aria-label="Settings">
          <Settings size={18} />
        </button>
        <button className="primary-button small" type="button">
          <Plus size={16} /> Add City
        </button>
      </div>
    </header>
  );
}

function TimerCard({
  icon,
  title,
  value,
  accent,
  running,
  onToggle,
  onReset
}: {
  icon: ReactNode;
  title: string;
  value: string;
  accent: "blue" | "orange" | "red";
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <article className={`timer-card ${accent}`}>
      <div className="timer-card-top">
        <span className="timer-icon">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{running ? "Running now" : "Ready when you are"}</p>
        </div>
      </div>
      <strong>{value}</strong>
      <div className="timer-actions">
        <button type="button" onClick={onToggle}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={onReset} aria-label={`Reset ${title}`}>
          <RotateCcw size={16} />
        </button>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand" href="/" aria-label="World On Time home">
        <span>
          <Clock3 size={19} />
        </span>
        World On Time
      </a>
      <div>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
        <a href="/faq">FAQ</a>
      </div>
    </footer>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
