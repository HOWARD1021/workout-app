"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, Dumbbell, Plus, Search, Star } from "lucide-react";
import {
  useWorkoutTemplates,
  type WorkoutTemplate,
} from "@/hooks/useWorkoutTemplates";
import DuckMascot from "./DuckMascot";
import { useTranslation } from "@/lib/i18n";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
  onStartEmpty: () => void;
}

export default function TemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
  onStartEmpty,
}: TemplateSelectorProps) {
  const { templates, loading } = useWorkoutTemplates();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (template: WorkoutTemplate) => {
    onSelectTemplate(template.id);
    onOpenChange(false);
  };

  const handleStartEmpty = () => {
    onStartEmpty();
    onOpenChange(false);
  };

  // Template card component
  const TemplateCard = ({ template }: { template: WorkoutTemplate }) => (
    <button
      onClick={() => handleSelect(template)}
      className="ios-row w-full text-left"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e9f8ee]">
          <DuckMascot muscleGroup={template.muscleGroup} size="sm" animate={false} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-[#111111]">
              {template.name}
            </h3>
            {template.isFavorite && (
              <Star className="h-4 w-4 shrink-0 fill-[#ffcc00] text-[#ffcc00]" />
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-[#6f6f78]">
            <span>{template.exercise_count || 0} exercises</span>
            {template.muscleGroup && (
              <span className="rounded-full bg-[#f2f2f7] px-2 py-0.5 text-xs">
              {template.muscleGroup}
            </span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#c7c7cc]" />
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bottom-0 !top-auto left-1/2 flex max-h-[88vh] w-full max-w-[430px] translate-x-[-50%] !translate-y-0 flex-col gap-0 overflow-hidden rounded-b-none rounded-t-[28px] border-0 bg-[#f2f2f7] p-0 shadow-2xl data-[state=open]:slide-in-from-bottom-8 data-[state=open]:zoom-in-100 sm:max-w-[430px]">
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-[#c7c7cc]" />
        <DialogHeader className="p-5 pb-2 text-left">
          <DialogTitle className="text-[28px] font-bold tracking-[-0.02em] text-[#111111]">
            {t("templates.selectTemplate")}
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-5 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8e93]" />
            <Input
              placeholder={t("templates.searchTemplates")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2">
          {loading ? (
            <div className="py-12 text-center text-[#8e8e93]">{t("common.loading")}</div>
          ) : filteredTemplates.length === 0 && !searchQuery ? (
            <div className="text-center py-12">
              <DuckMascot size="xl" className="mx-auto mb-4 opacity-50" />
              <p className="font-medium text-[#6f6f78]">{t("templates.noTemplates")}</p>
              <p className="mt-1 text-sm text-[#8e8e93]">
                {t("templates.noTemplatesHint")}
              </p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="mx-auto mb-2 h-12 w-12 text-[#c7c7cc]" />
              <p className="text-[#8e8e93]">{t("templates.noResults", { query: searchQuery })}</p>
            </div>
          ) : (
            <div className="ios-group">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>

        {/* Start Empty Button */}
        <div className="border-t border-[#d7d7dc] bg-[#f9f9fb]/90 p-5 backdrop-blur-xl">
          <Button
            className="w-full py-6"
            onClick={handleStartEmpty}
          >
            <Plus className="h-5 w-5 mr-2" />
            {t("templates.startEmpty")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
