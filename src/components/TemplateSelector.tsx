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
import { Star, Dumbbell, Search, Plus } from "lucide-react";
import {
  useWorkoutTemplates,
  type WorkoutTemplate,
} from "@/hooks/useWorkoutTemplates";
import DuckMascot from "./DuckMascot";

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
      className="w-full bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#58CC02] hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Icon Area */}
      <div className="h-[100px] bg-gradient-to-b from-[#F7F7F7] to-white flex items-center justify-center relative">
        <DuckMascot muscleGroup={template.muscleGroup} size="lg" animate={false} />
        {template.isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-3 text-left border-t border-[#F0F0F0]">
        <h3 className="font-bold text-[#3C3C3C] truncate group-hover:text-[#58CC02] transition-colors">
          {template.name}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-[#AFAFAF]">
          <Dumbbell className="h-3 w-3" />
          <span>{template.exercise_count || 0} exercises</span>
        </div>
        {template.muscleGroup && (
          <div className="mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#58CC02]">
              {template.muscleGroup}
            </span>
          </div>
        )}
      </div>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl font-bold text-[#3C3C3C]">
            選擇訓練模板 🦆
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AFAFAF]" />
            <Input
              placeholder="搜尋模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-[#E5E5E5] focus:border-[#58CC02]"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="text-center py-12 text-[#AFAFAF]">載入中...</div>
          ) : filteredTemplates.length === 0 && !searchQuery ? (
            <div className="text-center py-12">
              <DuckMascot size="xl" className="mx-auto mb-4 opacity-50" />
              <p className="text-[#AFAFAF] font-medium">還沒有模板</p>
              <p className="text-sm text-[#AFAFAF] mt-1">
                完成一次訓練後可以儲存為模板！
              </p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 mx-auto text-[#E5E5E5] mb-2" />
              <p className="text-[#AFAFAF]">找不到「{searchQuery}」</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>

        {/* Start Empty Button */}
        <div className="p-4 border-t bg-white">
          <Button
            variant="outline"
            className="w-full border-2 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#E8F7FE] py-6 rounded-xl font-bold"
            onClick={handleStartEmpty}
          >
            <Plus className="h-5 w-5 mr-2" />
            開始空白訓練
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
