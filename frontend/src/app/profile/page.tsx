"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Section } from "@/components/site/section";
import { categories } from "@/components/home/categories";
import { rentalsApi } from "@/lib/api/rentals-api";
import { uploadApi } from "@/lib/api/upload-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  LogOut,
  Settings,
  PackagePlus,
  MessageCircle,
  Layers3,
} from "lucide-react";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [slugSeed, setSlugSeed] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState({
    title: "",
    description: "",
    slug: "",
    price_per_day: "",
    category: categories[0]?.value ?? "bikes",
    status: "available",
    location_city: "",
    location_state: "",
    location_country: "",
  });
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    slug: "",
    price_per_day: "",
    category: categories[0]?.value ?? "bikes",
    status: "available",
    location_city: "",
    location_state: "",
    location_country: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const uploadMutation = useMutation({
    mutationFn: uploadApi.uploadMultiple,
  });

  const createMutation = useMutation({
    mutationFn: rentalsApi.create,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Rental listing created!");
        queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      } else {
        toast.error("Unable to create rental listing.");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Unable to create rental listing.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      data: {
        title: string;
        description: string;
        slug: string;
        price_per_day: number;
        images?: string[];
        category: string;
        status: "available" | "unavailable" | "paused";
        location_city?: string;
        location_state?: string;
        location_country?: string;
      };
    }) => rentalsApi.update(payload.id, payload.data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Listing updated!");
        queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      } else {
        toast.error("Unable to update listing.");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Unable to update listing.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: rentalsApi.remove,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.data?.message || "Listing deleted.");
        queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      } else {
        toast.error("Unable to delete listing.");
      }
    },
    onError: (error: any) => {
      toast.error(error.error?.message || "Unable to delete listing.");
    },
  });

  const {
    data: rentalsData,
    isLoading: isRentalsLoading,
    isError: isRentalsError,
  } = useQuery({
    queryKey: ["my-rentals"],
    queryFn: rentalsApi.listMine,
    enabled: isAuthenticated,
  });

  const rentalsDetails = rentalsData?.success ? rentalsData.data?.details : undefined;
  const publishedItems = useMemo(() => {
    if (!rentalsDetails) return [];
    if (Array.isArray(rentalsDetails)) return rentalsDetails;
    return rentalsDetails.items ?? [];
  }, [rentalsDetails]);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  useEffect(() => {
    const urls = editFiles.map((file) => URL.createObjectURL(file));
    setEditImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [editFiles]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;


  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const infoItems = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Phone Number", value: user.phone || "Not provided", icon: Phone },
  ];

  const accountItems = [
    { label: "Account Role", value: user.role, icon: ShieldCheck, className: "capitalize" },
    { label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }), icon: Calendar },
  ];

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "title") {
      const base = slugify(value);
      const seed = slugSeed || (base ? Date.now().toString() : "");
      if (seed && !slugSeed) {
        setSlugSeed(seed);
      }
      setFormState((prev) => ({
        ...prev,
        title: value,
        slug: base ? `${base}-${seed}` : "",
      }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEditState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 4) {
      toast.error("You can upload up to 4 images at a time.");
      event.target.value = "";
      return;
    }
    setSelectedFiles(files);
  };

  const handleEditFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const totalCount = editImages.length + files.length;
    if (totalCount > 4) {
      toast.error("You can upload up to 4 images in total.");
      event.target.value = "";
      return;
    }
    setEditFiles(files);
  };



  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      slug: "",
      price_per_day: "",
      category: categories[0]?.value ?? "bikes",
      status: "available",
      location_city: "",
      location_state: "",
      location_country: "",
    });
    setSelectedFiles([]);
    setSlugSeed("");
  };

  const startEditing = (item: {
    id: string;
    title: string;
    description: string;
    slug: string;
    price_per_day: number;
    category: string;
    status: string;
    images?: string[];
    location_city?: string;
    location_state?: string;
    location_country?: string;
  }) => {
    setEditingId(item.id);
    setEditState({
      title: item.title,
      description: item.description,
      slug: item.slug,
      price_per_day: String(item.price_per_day),
      category: item.category,
      status: item.status,
      location_city: item.location_city || "",
      location_state: item.location_state || "",
      location_country: item.location_country || "",
    });
    setEditImages(item.images || []);
    setEditFiles([]);
    setEditImagePreviews([]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditImages([]);
    setEditFiles([]);
    setEditImagePreviews([]);
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();

    if (!editState.title.trim() || !editState.description.trim() || !editState.slug.trim()) {
      toast.error("Title, description, and slug are required.");
      return;
    }

    if (editState.title.trim().length > 120) {
      toast.error("Title must be 120 characters or less.");
      return;
    }

    const priceValue = Number(editState.price_per_day);
    if (!priceValue || priceValue < 1) {
      toast.error("Price per day must be at least 1.");
      return;
    }

    if (editImages.length === 0 && editFiles.length === 0) {
      toast.error("Please keep or add at least one image.");
      return;
    }

    let finalImages = editImages;

    if (editFiles.length > 0) {
      const uploadResponse = await uploadMutation.mutateAsync({
        files: editFiles,
        folder: "/rentals",
      });

      if (!uploadResponse.success) {
        toast.error(uploadResponse.error?.message || "Image upload failed.");
        return;
      }

      const newUrls =
        uploadResponse.data?.details?.map((item) => item.url) ?? [];
      finalImages = [...editImages, ...newUrls].slice(0, 4);
    }

    await updateMutation.mutateAsync({
      id,
      data: {
        title: editState.title,
        description: editState.description,
        slug: editState.slug,
        price_per_day: priceValue,
        images: finalImages,
        category: editState.category,
        status: editState.status as "available" | "unavailable" | "paused",
        location_city: editState.location_city || undefined,
        location_state: editState.location_state || undefined,
        location_country: editState.location_country || undefined,
      },
    });

    setEditingId(null);
    setEditImages([]);
    setEditFiles([]);
    setEditImagePreviews([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.description.trim() || !formState.slug.trim()) {
      toast.error("Title, description, and slug are required.");
      return;
    }

    if (formState.title.trim().length > 120) {
      toast.error("Title must be 120 characters or less.");
      return;
    }

    const priceValue = Number(formState.price_per_day);
    if (!priceValue || priceValue < 1) {
      toast.error("Price per day must be at least 1.");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please add at least one image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadResponse = await uploadMutation.mutateAsync({
        files: selectedFiles,
        folder: "/rentals",
      });

      if (!uploadResponse.success) {
        toast.error(uploadResponse.error?.message || "Image upload failed.");
        setIsSubmitting(false);
        return;
      }

      const imageUrls =
        uploadResponse.data?.details?.map((item) => item.url) ?? [];

      if (imageUrls.length === 0) {
        toast.error("No images were uploaded.");
        setIsSubmitting(false);
        return;
      }

      const createResponse = await createMutation.mutateAsync({
        title: formState.title,
        description: formState.description,
        slug: formState.slug,
        price_per_day: priceValue,
        images: imageUrls,
        category: formState.category,
        status: formState.status as "available" | "unavailable" | "paused",
        location_city: formState.location_city || undefined,
        location_state: formState.location_state || undefined,
        location_country: formState.location_country || undefined,
      });

      if (createResponse.success) {
        resetForm();
        setActiveTab("published");
      }
    } catch (error: any) {
      toast.error(error?.error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="min-h-screen pb-20">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded bg-primary/10 text-3xl font-bold tracking-tighter text-primary ring-2 ring-background shadow-sm">
                {initials}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Profile
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                <span className="mt-3 inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="self-start rounded shrink-0"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add">Add Rental</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="flex items-center text-lg font-semibold">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Personal Information
                </h2>
                <div className="mt-6 space-y-5">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted/50 text-muted-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-base font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="flex items-center text-lg font-semibold">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Account Details
                </h2>
                <div className="mt-6 space-y-5">
                  {accountItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted/50 text-muted-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className={`text-base font-medium text-foreground ${item.className || ""}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="flex h-11 w-11 items-center justify-center rounded bg-primary/10 text-primary">
                  <PackagePlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Add a new rental</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload up to 4 images and publish your listing.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Listing Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Trek FX 3 Hybrid Bike"
                        value={formState.title}
                        onChange={handleInputChange}
                        maxLength={120}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formState.title.length}/120 characters
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the item, condition, and what's included."
                        value={formState.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="slug">Listing Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          placeholder="trek-fx-3"
                          value={formState.slug}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Auto-generated from the title.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price_per_day">Price per day</Label>
                        <Input
                          id="price_per_day"
                          name="price_per_day"
                          type="number"
                          min="1"
                          placeholder="25"
                          value={formState.price_per_day}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          value={formState.category}
                          onChange={handleInputChange}
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          name="status"
                          value={formState.status}
                          onChange={handleInputChange}
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <option value="available">Available</option>
                          <option value="unavailable">Unavailable</option>
                          <option value="paused">Paused</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="location_city">City</Label>
                        <Input
                          id="location_city"
                          name="location_city"
                          placeholder="Austin"
                          value={formState.location_city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location_state">State</Label>
                        <Input
                          id="location_state"
                          name="location_state"
                          placeholder="TX"
                          value={formState.location_state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location_country">Country</Label>
                        <Input
                          id="location_country"
                          name="location_country"
                          placeholder="USA"
                          value={formState.location_country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full flex-col gap-4 rounded-lg border border-dashed border-border/70 bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="images">Images</Label>
                        <p className="text-xs text-muted-foreground">
                          Up to 4 images, 10MB each.
                        </p>
                      </div>
                      <span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                        {selectedFiles.length}/4
                      </span>
                    </div>

                    <Input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {imagePreviews.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="relative overflow-hidden rounded-md border bg-card"
                          >
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
                        Add images to preview them here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Rental"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="flex h-11 w-11 items-center justify-center rounded bg-primary/10 text-primary">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Published listings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your active rental products.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {isRentalsLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`rental-skeleton-${index}`}
                        className="h-32 rounded-lg border bg-muted/40"
                      />
                    ))}
                  </div>
                ) : isRentalsError ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    We couldn&apos;t load your listings right now.
                  </div>
                ) : publishedItems.length === 0 ? (
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    You haven&apos;t published any rentals yet.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {publishedItems.map((item) => (
                      <article
                        key={item.id}
                        className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm"
                      >
                         <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.description}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/30" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-3">
                          {editingId === item.id ? (
                            <form
                              className="grid gap-3"
                              onSubmit={(event) => handleUpdate(event, item.id)}
                            >
                              <div className="grid gap-2">
                                <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
                                <Input
                                  id={`edit-title-${item.id}`}
                                  name="title"
                                  value={editState.title}
                                  onChange={handleEditChange}
                                  maxLength={120}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`edit-description-${item.id}`}>Description</Label>
                                <Textarea
                                  id={`edit-description-${item.id}`}
                                  name="description"
                                  value={editState.description}
                                  onChange={handleEditChange}
                                />
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-slug-${item.id}`}>Slug</Label>
                                  <Input
                                    id={`edit-slug-${item.id}`}
                                    name="slug"
                                    value={editState.slug}
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-price-${item.id}`}>Price per day</Label>
                                  <Input
                                    id={`edit-price-${item.id}`}
                                    name="price_per_day"
                                    type="number"
                                    min="1"
                                    value={editState.price_per_day}
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-category-${item.id}`}>Category</Label>
                                  <select
                                    id={`edit-category-${item.id}`}
                                    name="category"
                                    value={editState.category}
                                    onChange={handleEditChange}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                  >
                                    {categories.map((category) => (
                                      <option key={category.value} value={category.value}>
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-status-${item.id}`}>Status</Label>
                                  <select
                                    id={`edit-status-${item.id}`}
                                    name="status"
                                    value={editState.status}
                                    onChange={handleEditChange}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                  >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="paused">Paused</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-city-${item.id}`}>City</Label>
                                  <Input
                                    id={`edit-city-${item.id}`}
                                    name="location_city"
                                    value={editState.location_city}
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-state-${item.id}`}>State</Label>
                                  <Input
                                    id={`edit-state-${item.id}`}
                                    name="location_state"
                                    value={editState.location_state}
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-country-${item.id}`}>Country</Label>
                                  <Input
                                    id={`edit-country-${item.id}`}
                                    name="location_country"
                                    value={editState.location_country}
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`edit-images-${item.id}`}>Images</Label>
                                <Input
                                  id={`edit-images-${item.id}`}
                                  name="images"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleEditFileChange}
                                />
                                <div className="flex flex-wrap gap-2">
                                  {editImages.map((image) => (
                                    <div
                                      key={image}
                                      className="group relative h-20 w-20 overflow-hidden rounded-md border border-border bg-muted"
                                    >
                                      <img
                                        src={image}
                                        alt="Existing"
                                        className="h-full w-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditImages((prev) =>
                                            prev.filter((item) => item !== image)
                                          )
                                        }
                                        className="absolute right-1 top-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] text-muted-foreground shadow-sm opacity-0 transition group-hover:opacity-100"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                  {editImagePreviews.map((image, index) => (
                                    <div
                                      key={`${image}-${index}`}
                                      className="h-20 w-20 overflow-hidden rounded-md border border-dashed border-border bg-muted/20"
                                    >
                                      <img
                                        src={image}
                                        alt={`New ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {editImages.length === 0 && editImagePreviews.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                      Add or keep at least one image.
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Button type="submit" size="sm">
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div>
                                <h3 className="text-base font-semibold">
                                  {item.title || item.description}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.category} • {item.status}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>₹{item.price_per_day}/day</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEditing(item)}
                                  >
                                    Edit
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete this listing?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action can&apos;t be undone. The listing will be permanently removed.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteMutation.mutate(item.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chats">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="flex h-11 w-11 items-center justify-center rounded bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Chats</h2>
                  <p className="text-sm text-muted-foreground">
                    Messaging is coming soon. We&apos;ll surface your rental
                    conversations here.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
                Start a rental conversation from a listing to see messages in
                this space.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}
