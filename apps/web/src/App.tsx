import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  SearchIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  SlidersHorizontalIcon,
  CodeIcon,
  DownloadIcon,
  CopyIcon,
  RotateCcwIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
} from "lucide-react";
import { iconCatalog } from "@colorful-icons/react/catalog";
import {
  IconContext,
  palettePresets,
  type IconWeight,
  type IconTheme,
  type IconPreset,
  type IconPalette,
  type IconEntrance,
  type IconHover,
  type IconEasing,
} from "@colorful-icons/react/lib";
import { BrandLogo } from "@/components/brand-logo";
import { DocsPage } from "@/components/docs-page";
import { CatalogIcon } from "@/components/catalog/catalog-icon";
import {
  ChoiceField,
  ColorField,
  RangeField,
} from "@/components/catalog/controls";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  categoryLabel,
  iconLabel,
  initialLocale,
  localeStorageKey,
  matchesQuery,
  messages,
  optionLabel,
  type Locale,
} from "@/lib/i18n";
import { downloadSVG, standaloneSVG } from "./export";

type Entry = (typeof iconCatalog)[number];
const weights: IconWeight[] = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
];
const presets = Object.keys(palettePresets) as IconPreset[];
const pageSize = 48;

export function App() {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = messages[locale];
  const [theme, setTheme] = useState<IconTheme>("light");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [...new Set(iconCatalog.map((icon) => icon.category))];
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Entry>(iconCatalog[0]);
  const [weight, setWeight] = useState<IconWeight>("regular");
  const [size, setSize] = useState(40);
  const [preset, setPreset] = useState<IconPreset>("lavender");
  const [custom, setCustom] = useState<IconPalette>({});
  const [entrance, setEntrance] = useState<IconEntrance>("pop");
  const [hoverAnimation, setHoverAnimation] = useState<IconHover>("morph");
  const [hoverEasing, setHoverEasing] = useState<IconEasing>("spring");
  const [hoverDuration, setHoverDuration] = useState(900);
  const [hoverStagger, setHoverStagger] = useState(65);
  const [mirrored, setMirrored] = useState(false);
  const [mirrorDuration, setMirrorDuration] = useState(450);
  const [animationKey, setAnimationKey] = useState(0);
  const [hoverReplayKey, setHoverReplayKey] = useState(0);
  const [view, setView] = useState<"collection" | "docs">(() =>
    typeof window !== "undefined" && window.location.hash === "#docs"
      ? "docs"
      : "collection",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeTab, setCodeTab] = useState("jsx");
  const [svgCode, setSvgCode] = useState("");
  const desktopPreview = useRef<HTMLDivElement>(null);
  const mobilePreview = useRef<HTMLDivElement>(null);
  const palette = useMemo(
    () => ({ ...palettePresets[preset][theme], ...custom }),
    [preset, theme, custom],
  );
  const filtered = useMemo(
    () =>
      iconCatalog.filter(
        (icon) =>
          (category === "all" || icon.category === category) &&
          matchesQuery(icon, query),
      ),
    [category, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const context = {
    size,
    weight,
    theme,
    preset,
    palette,
    entrance,
    hoverAnimation,
    hoverEasing,
    hoverDuration,
    hoverStagger,
    mirrored,
    mirrorDuration,
    animationKey,
  };
  const code = `import { ${selected.component}Icon } from "@colorful-icons/react/${selected.component}";\n\n<${selected.component}Icon\n  size={${size}}\n  weight="${weight}"\n  theme="${theme}"\n  preset="${preset}"${Object.keys(custom).length ? `\n  palette={${JSON.stringify(palette)}}` : ""}\n  entrance="${entrance}"\n  hoverAnimation="${hoverAnimation}"\n  hoverEasing="${hoverEasing}"\n  hoverDuration={${hoverDuration}}\n  hoverStagger={${hoverStagger}}\n  mirrored={${mirrored}}\n  mirrorDuration={${mirrorDuration}}\n/>`;

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = t.title;
    try {
      localStorage.setItem(localeStorageKey, locale);
    } catch {
      /* Optional persistence. */
    }
  }, [locale, t.title]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    const onHashChange = () =>
      setView(window.location.hash === "#docs" ? "docs" : "collection");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  function navigate(next: "collection" | "docs") {
    const hash = next === "docs" ? "#docs" : "#collection";
    setView(next);
    if (window.location.hash !== hash) window.location.hash = hash;
  }
  function getSVG() {
    const source = (
      mobilePreview.current ?? desktopPreview.current
    )?.querySelector("svg");
    if (!source) {
      toast.info(t.svgPending);
      return null;
    }
    return standaloneSVG(source, theme, palette);
  }
  async function copy(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(success);
    } catch {
      setCodeOpen(true);
      toast.error(t.clipboardFailed);
    }
  }
  function showCode(tab = "jsx") {
    setSvgCode(getSVG() ?? "");
    setCodeTab(tab);
    setCodeOpen(true);
  }
  function selectIcon(entry: Entry) {
    setSelected(entry);
    if (window.matchMedia("(max-width: 1023px)").matches) setMobileOpen(true);
  }
  function resetSearch() {
    setQuery("");
    setCategory("all");
    setPage(0);
  }
  function closeSheet() {
    return (
      <SheetClose asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-4 top-4"
          aria-label={t.close}
        >
          <XIcon />
        </Button>
      </SheetClose>
    );
  }

  function renderDetails(previewRef: RefObject<HTMLDivElement | null>) {
    const mirrorId =
      previewRef === desktopPreview ? "desktop-mirror" : "mobile-mirror";
    return (
      <div className="flex flex-col gap-6">
        <div
          className="relative flex min-h-48 items-center justify-center rounded-2xl bg-muted/60"
          data-colorful-hover-target=""
          aria-label={t.preview}
        >
          <div
            ref={previewRef}
            className="flex items-center justify-center"
            style={{ transform: "scale(2)" }}
          >
            <CatalogIcon
              name={selected.component}
              messages={t}
              hoverReplayKey={hoverReplayKey}
            />
          </div>
          <span className="absolute bottom-3 left-4 text-xs text-muted-foreground">
            {size} px · 2×
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute bottom-2 right-3"
            onClick={() => setHoverReplayKey((key) => key + 1)}
            aria-label={t.replayHover}
          >
            <PlayIcon />
          </Button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">
              {iconLabel(selected, locale)}
            </h2>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {selected.component}Icon
            </p>
          </div>
          <span className="pt-1 text-xs text-muted-foreground">
            {categoryLabel(selected.category, locale)}
          </span>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel>{t.weight}</FieldLabel>
            <ToggleGroup
              type="single"
              value={weight}
              onValueChange={(value) => value && setWeight(value as IconWeight)}
              className="grid w-full grid-cols-3"
              aria-label={t.weight}
              spacing={1}
            >
              {weights.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-label={optionLabel(value, locale)}
                >
                  {optionLabel(value, locale)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
          <RangeField
            label={t.size}
            value={size}
            min={20}
            max={64}
            step={2}
            unit="px"
            onChange={setSize}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldSet>
            <FieldLegend
              variant="label"
              className="mb-0 flex w-full items-center justify-between gap-2"
            >
              <span>{t.palette}</span>
              <Button variant="ghost" size="sm" onClick={() => setCustom({})}>
                <RotateCcwIcon data-icon="inline-start" />
                {t.resetColors}
              </Button>
            </FieldLegend>
            <ToggleGroup
              type="single"
              value={Object.keys(custom).length ? "" : preset}
              onValueChange={(value) => {
                if (value) {
                  setPreset(value as IconPreset);
                  setCustom({});
                }
              }}
              className="grid w-full grid-cols-8"
              size="sm"
              aria-label={t.palette}
              spacing={1}
            >
              {presets.map((value) => (
                <ToggleGroupItem
                  className="min-w-0 px-1"
                  key={value}
                  value={value}
                  aria-label={optionLabel(value, locale)}
                  title={optionLabel(value, locale)}
                >
                  <span
                    className="flex size-5 overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    {Object.values(palettePresets[value][theme]).map(
                      (color) => (
                        <span
                          key={color}
                          className="h-full flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldGroup className="grid grid-cols-3 gap-3">
              {(["surface", "back", "detail"] as const).map((key) => (
                <ColorField
                  key={key}
                  label={t[key]}
                  color={palette[key]}
                  messages={t}
                  onChange={(value) =>
                    setCustom((current) => ({ ...current, [key]: value }))
                  }
                />
              ))}
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend variant="label" className="mb-2">
              {t.motion}
            </FieldLegend>
            <FieldGroup>
              <FieldGroup className="grid grid-cols-2 gap-3">
                <ChoiceField
                  label={t.entrance}
                  value={entrance}
                  values={["pop", "rise", "fade", "none"]}
                  locale={locale}
                  onChange={(value) => {
                    setEntrance(value);
                    setAnimationKey((key) => key + 1);
                  }}
                />
                <ChoiceField
                  label={t.hover}
                  value={hoverAnimation}
                  values={[
                    "morph",
                    "lift",
                    "wiggle",
                    "pulse",
                    "spread",
                    "none",
                  ]}
                  locale={locale}
                  onChange={setHoverAnimation}
                />
              </FieldGroup>
              <ChoiceField
                label={t.easing}
                value={hoverEasing}
                values={["smooth", "gentle", "snappy", "spring", "linear"]}
                locale={locale}
                onChange={setHoverEasing}
              />
              <FieldGroup className="grid grid-cols-2 gap-3">
                <RangeField
                  label={t.duration}
                  value={hoverDuration}
                  min={200}
                  max={1200}
                  step={50}
                  unit="ms"
                  onChange={setHoverDuration}
                />
                <RangeField
                  label={t.stagger}
                  value={hoverStagger}
                  min={0}
                  max={150}
                  step={5}
                  unit="ms"
                  onChange={setHoverStagger}
                />
              </FieldGroup>
              <FieldGroup className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel
                    className="min-h-5 text-xs text-muted-foreground"
                    htmlFor={mirrorId}
                  >
                    {t.flip}
                  </FieldLabel>
                  <div className="flex h-5 items-center">
                    <Switch
                      id={mirrorId}
                      checked={mirrored}
                      onCheckedChange={setMirrored}
                    />
                  </div>
                </Field>
                <RangeField
                  label={t.flipDuration}
                  value={mirrorDuration}
                  min={0}
                  max={1000}
                  step={50}
                  unit="ms"
                  onChange={setMirrorDuration}
                />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnimationKey((key) => key + 1)}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  {t.replayEntrance}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHoverReplayKey((key) => key + 1)}
                >
                  <PlayIcon data-icon="inline-start" />
                  {t.replayHover}
                </Button>
              </div>
              <FieldDescription className="text-xs">
                {t.reducedMotion}
              </FieldDescription>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              setCodeTab("jsx");
              void copy(code, t.copiedJSX);
            }}
          >
            <CodeIcon data-icon="inline-start" />
            {t.copyJSX}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              const svg = getSVG();
              if (svg) {
                downloadSVG(svg, `${selected.name}-${weight}-${theme}.svg`);
                toast.success(t.downloaded);
              }
            }}
          >
            <DownloadIcon data-icon="inline-start" />
            {t.download}
          </Button>
          <div className="col-span-2 flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const svg = getSVG();
                if (svg) {
                  setSvgCode(svg);
                  setCodeTab("svg");
                  void copy(svg, t.copiedSVG);
                }
              }}
            >
              {t.copySVG}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => showCode()}>
              {t.viewCode}
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <IconContext.Provider value={context}>
      <div
        className="mx-auto min-h-screen max-w-[1440px] px-5 sm:px-10 lg:px-16"
        data-colorful-theme={theme}
      >
        <header className="flex h-24 items-center justify-between gap-4">
          <a href="#collection" aria-label={t.home} className="shrink-0" onClick={() => setView("collection")}>
            <BrandLogo className="h-8 w-auto text-2xl" />
          </a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="#docs" onClick={() => setView("docs")}>
                <BookOpenIcon data-icon="inline-start" />
                {t.docs}
              </a>
            </Button>
            <ToggleGroup
              type="single"
              value={locale}
              onValueChange={(value) => value && setLocale(value as Locale)}
              aria-label={t.language}
              size="sm"
              spacing={0}
            >
              <ToggleGroupItem value="zh" aria-label="中文">
                中
              </ToggleGroupItem>
              <ToggleGroupItem value="en" aria-label="English">
                EN
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`${t.theme}: ${theme === "light" ? t.dark : t.light}`}
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setCustom({});
              }}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>
        </header>
        <main className="pb-12">
          {view === "docs" ? (
            <DocsPage locale={locale} onBrowse={() => navigate("collection")} />
          ) : (
            <>
          <section
            className="flex flex-col gap-5 pb-14 pt-10 sm:pb-16 sm:pt-14"
            aria-labelledby="hero-title"
          >
            <h1
              id="hero-title"
              className="max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t.hero}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>
                <span className="font-medium tabular-nums text-foreground">
                  {iconCatalog.length.toLocaleString(
                    locale === "zh" ? "zh-CN" : "en-US",
                  )}
                </span>{" "}
                {t.icons}
              </span>
              <span>
                <span className="font-medium text-foreground">6</span>{" "}
                {t.weights}
              </span>
              <span>
                <span className="font-medium text-foreground">
                  {presets.length}
                </span>{" "}
                {t.palettes}
              </span>
            </div>
          </section>
          <section
            id="collection"
            aria-label={t.collection}
            className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:gap-14 xl:grid-cols-[minmax(0,1fr)_300px]"
          >
            <div className="min-w-0">
              <FieldGroup className="flex-row flex-wrap items-end gap-3">
                <Field className="min-w-48 flex-1">
                  <FieldLabel htmlFor="search" className="sr-only">
                    {t.searchLabel}
                  </FieldLabel>
                  <InputGroup className="h-11">
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="search"
                      value={query}
                      placeholder={t.search}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(0);
                      }}
                    />
                    {query && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          aria-label={t.clearSearch}
                          onClick={() => {
                            setQuery("");
                            setPage(0);
                          }}
                        >
                          <XIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </Field>
                <Field className="w-auto">
                  <FieldLabel htmlFor="category" className="sr-only">
                    {t.category}
                  </FieldLabel>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setPage(0);
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      size="lg"
                      className="w-40 sm:w-44"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">{t.all}</SelectItem>
                        {categories.map((value) => (
                          <SelectItem key={value} value={value}>
                            {categoryLabel(value, locale)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <div className="flex items-center justify-between gap-3 py-6">
                <p className="text-xs text-muted-foreground" aria-live="polite">
                  {filtered.length.toLocaleString()} {t.results}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <SlidersHorizontalIcon data-icon="inline-start" />
                  {t.details}
                </Button>
                <span className="hidden text-xs text-muted-foreground lg:block">
                  SVG · React
                </span>
              </div>
              {visible.length ? (
                <div
                  className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 xl:grid-cols-6"
                  aria-label={t.collection}
                >
                  {visible.map((entry, index) => (
                    <Button
                      key={entry.name}
                      variant={
                        selected.name === entry.name ? "secondary" : "ghost"
                      }
                      className="relative h-auto min-w-0 flex-col gap-3 px-2 py-5"
                      aria-label={`${iconLabel(entry, locale)} ${entry.component}Icon`}
                      aria-pressed={selected.name === entry.name}
                      data-colorful-hover-target=""
                      onClick={() => selectIcon(entry)}
                    >
                      <span className="flex h-16 items-center justify-center">
                        <CatalogIcon
                          name={entry.component}
                          messages={t}
                          animationDelay={Math.min(index * 8, 160)}
                          className="size-auto"
                          style={{ width: size, height: size }}
                        />
                      </span>
                      <span
                        className="w-full truncate text-center text-xs"
                        title={iconLabel(entry, locale)}
                      >
                        {iconLabel(entry, locale)}
                      </span>
                    </Button>
                  ))}
                </div>
              ) : (
                <Empty className="min-h-96">
                  <EmptyHeader>
                    <EmptyTitle>{t.empty}</EmptyTitle>
                    <EmptyDescription>{t.emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="secondary" onClick={resetSearch}>
                      {t.resetSearch}
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
              {pageCount > 1 && (
                <Pagination className="mt-10" aria-label={t.pagination}>
                  <PaginationContent className="w-full justify-between">
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        disabled={page === 0}
                        onClick={() => setPage((current) => current - 1)}
                      >
                        <ChevronLeftIcon data-icon="inline-start" />
                        {t.previous}
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <span
                        className="text-xs tabular-nums text-muted-foreground"
                        aria-live="polite"
                      >
                        {page + 1} / {pageCount}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        disabled={page + 1 >= pageCount}
                        onClick={() => setPage((current) => current + 1)}
                      >
                        {t.next}
                        <ChevronRightIcon data-icon="inline-end" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
            <aside className="hidden min-w-0 lg:block" aria-label={t.details}>
              {renderDetails(desktopPreview)}
            </aside>
          </section>
            </>
          )}
        </main>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            className="min-w-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-md"
            showCloseButton={false}
          >
            <SheetHeader>
              <SheetTitle>{t.details}</SheetTitle>
              <SheetDescription className="sr-only">
                {t.preview}
              </SheetDescription>
            </SheetHeader>
            {closeSheet()}
            <div className="px-5 pb-6">{renderDetails(mobilePreview)}</div>
          </SheetContent>
        </Sheet>
        <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
          <DialogContent
            className="min-w-0 sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle>{t.code}</DialogTitle>
              <DialogDescription>{t.codeDescription}</DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3"
                aria-label={t.close}
              >
                <XIcon />
              </Button>
            </DialogClose>
            <Tabs
              className="min-w-0 w-full max-w-full"
              value={codeTab}
              onValueChange={(value) => {
                setCodeTab(value);
                if (value === "svg") setSvgCode(getSVG() ?? svgCode);
              }}
            >
              <TabsList>
                <TabsTrigger value="jsx">{t.jsx}</TabsTrigger>
                <TabsTrigger value="svg">{t.svg}</TabsTrigger>
              </TabsList>
              <TabsContent value="jsx" className="min-w-0 max-w-full">
                <pre
                  className="min-w-0 max-w-full max-h-[55vh] overflow-auto rounded-lg bg-muted p-4 text-xs leading-relaxed"
                  tabIndex={0}
                >
                  <code>{code}</code>
                </pre>
              </TabsContent>
              <TabsContent value="svg" className="min-w-0 max-w-full">
                <pre
                  className="min-w-0 max-w-full max-h-[55vh] overflow-auto rounded-lg bg-muted p-4 text-xs leading-relaxed"
                  tabIndex={0}
                >
                  <code>{svgCode}</code>
                </pre>
              </TabsContent>
            </Tabs>
            <Button
              className="justify-self-end"
              onClick={() =>
                void copy(
                  codeTab === "jsx" ? code : svgCode,
                  codeTab === "jsx" ? t.copiedJSX : t.copiedSVG,
                )
              }
            >
              <CopyIcon data-icon="inline-start" />
              {t.copy}
            </Button>
          </DialogContent>
        </Dialog>
        <Toaster
          theme={theme}
          position="bottom-center"
          containerAriaLabel={t.notifications}
        />
      </div>
    </IconContext.Provider>
  );
}
