import { Zap, Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSubmitClick: () => void;
}

export function Header({ onSubmitClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              VibeLaunch
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search apps..."
                className="w-full pl-9 bg-secondary border-transparent focus:border-border"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSubmitClick}
              className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Submit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
