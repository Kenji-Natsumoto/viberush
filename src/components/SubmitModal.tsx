import { useState } from "react";
import { X, Type, FileText, User, CheckCircle2, ChevronRight, Eye, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProduct } from "@/hooks/useProducts";
import { fireConfetti } from "@/lib/confetti";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDetails?: (productId: string) => void;
}

export function SubmitModal({ isOpen, onClose, onOpenDetails }: SubmitModalProps) {
  const { user } = useAuth();
  const createProduct = useCreateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [makerName, setMakerName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  // Success state
  const [submittedProductId, setSubmittedProductId] = useState<string | null>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!makerName.trim()) newErrors.makerName = "Maker name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setMakerName("");
    setShowPreview(false);
    setErrors({});
    setSubmittedProductId(null);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const product = await createProduct.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        proxyCreatorName: makerName.trim(),
      });
      setSubmittedProductId(product.id);
      fireConfetti();
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDone = () => {
    resetForm();
    onClose();
  };

  const handleAddDetails = () => {
    if (submittedProductId && onOpenDetails) {
      onOpenDetails(submittedProductId);
    }
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Success state
  if (submittedProductId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleDone} />
        <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Shipped! 🎉</h2>
            <p className="text-sm text-muted-foreground">
              Your proof is now live on VibeRush. You can add more details now or come back later.
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-secondary/50">
            <Button variant="outline" onClick={handleDone} className="flex-1">
              Done
            </Button>
            <Button onClick={handleAddDetails} className="flex-1 gap-2">
              Add details now
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Submit Your Proof</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Login Required Message */}
          {!user && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please <a href="/auth?mode=signup" className="underline font-medium">sign up</a> to submit.
              </p>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              Product Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
              placeholder="e.g. VibeFlow"
              className="bg-secondary border-transparent focus:border-border"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Description * <span className="text-xs text-muted-foreground">(Markdown supported)</span>
              </Label>
              {description.trim() && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPreview ? <Pencil className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPreview ? "Edit" : "Preview"}
                </button>
              )}
            </div>
            {showPreview ? (
              <div className="min-h-[104px] w-full rounded-md bg-secondary px-3 py-2 text-sm prose prose-sm max-w-none text-foreground">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="text-foreground [&>p]:inline [&>p]:m-0">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {description}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                id="description"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: "" })); }}
                placeholder={"What does your app do?\n\nUse **bold**, *italic*, - lists, and [links](url)"}
                rows={4}
                className="bg-secondary border-transparent focus:border-border resize-none"
              />
            )}
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Maker Name */}
          <div className="space-y-2">
            <Label htmlFor="makerName" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Maker Name *
            </Label>
            <Input
              id="makerName"
              value={makerName}
              onChange={(e) => { setMakerName(e.target.value); setErrors(prev => ({ ...prev, makerName: "" })); }}
              placeholder="e.g. Jane Doe / Team Name"
              className="bg-secondary border-transparent focus:border-border"
            />
            {errors.makerName && <p className="text-xs text-destructive">{errors.makerName}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-secondary/50">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (!validate()) return;
                try {
                  const product = await createProduct.mutateAsync({
                    name: name.trim(),
                    description: description.trim(),
                    proxyCreatorName: makerName.trim(),
                  });
                  fireConfetti();
                  resetForm();
                  onClose();
                  if (onOpenDetails) onOpenDetails(product.id);
                } catch (error) {
                  // Error handled in mutation
                }
              }}
              disabled={!user || createProduct.isPending}
              className="gap-1 text-sm"
            >
              Add details
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!user || createProduct.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createProduct.isPending ? "Submitting..." : "Submit (quick)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
