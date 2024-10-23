"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  // State variables
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [homePageProduct, setHomePageProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [homeProductImgSrc, setHomeProductImgSrc] = useState(
    "/images/placeholder.png"
  );
  const [quantity, setQuantity] = useState(1);

  // Hooks
  const { toast } = useToast();
  const router = useRouter();
  const { addToCart } = useCart();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/settings/home"),
          fetch("/api/products"),
        ]);

        if (!settingsRes.ok)
          throw new Error("Failed to fetch home page settings");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const settingsData = await settingsRes.json();
        const productsData = await productsRes.json();

        if (settingsData.featuredProductId) {
          const homeProductRes = await fetch(
            `/api/products/${settingsData.featuredProductId}`
          );
          if (homeProductRes.ok) {
            const homeProductData = await homeProductRes.json();
            setHomePageProduct(homeProductData.product);
            setHomeProductImgSrc(homeProductData.product.image);
          } else {
            console.error("Failed to fetch home page product");
            setHomePageProduct(null);
          }
        } else {
          setHomePageProduct(null);
        }

        const featuredProductIds = settingsData.featuredProductIds || [];
        const featuredProducts = productsData.products.filter((product) =>
          featuredProductIds.includes(product._id)
        );
        setFeaturedProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load page data",
          variant: "destructive",
        });
        setFeaturedProducts([]);
        setHomePageProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (homePageProduct) {
        const orderData = {
          items: [{
            id: homePageProduct._id,
            name: homePageProduct.name,
            price: homePageProduct.price,
            quantity: quantity,
            image: homePageProduct.image
          }],
          shippingAddress: address,
          name,
          mobile: phone,
          total: homePageProduct.price * quantity,
          isGuest: true
        };

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const data = await response.json();
        toast({
          title: "Success",
          description: "Order placed successfully",
        });
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        throw new Error("No product selected for order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="/images/hero-bg.jpg"
          alt="Pleasure BD Hero"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              100% সিলিকনের তৈরি
              <br />
              অরিজিনাল ম্যাজিক কনডম
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground mb-10 max-w-2xl">
              যৌন দুর্বলতা থেকে মুক্তি পেতে এবং দীর্ঘক্ষণ সঙ্গম করতে পারবেন,
              ৩০-৪০ মিনিট পর্যন্ত সঙ্গম করতে পারবেন।
            </p>
            <Button
              asChild
              size="lg"
              className="text-xl py-6 px-10"
            >
              <Link href="#order-form">অর্ডার করুন এখন</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Featured Products Section */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No featured products available.
            </p>
          )}
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-purple-900 text-white rounded-3xl p-12 md:p-20">
          <h2 className="text-4xl font-bold mb-10 text-center">
            কেন নিবেন এই ম্যাজিক কনডম?
          </h2>
          <p className="text-xl mb-10 text-center max-w-3xl mx-auto">
            আপনি কি আপনার স্ত্রীকে খুশি দেখে চান? আপনি ক আপনার স্ত্রীকে আরও
            আনন্দ দিত চান? তাহলে সাধারণ কনডমের রিবর্তে ম্যাজিক কনডম ব্যহার করুন
            (এই কনডমটি সিলিকন দিয়ে তৈরি)।
          </p>
          <ul className="space-y-6 max-w-2xl mx-auto">
            {[
              "৩০ থেকে ৪০ মিনিট পর্যন্ত অবিরাম সঙ্গম করতে সক্ষম হবেন।",
              "এই কনডমটি খব নরম এবং পিচ্ছিল।",
              "সঙ্গী এতে কোনও ব্যথা অনুভব করবে না (সাধারণ কনডমের মতোই নরম)।",
              "এটি ব্যবহারে কোনও ক্ষতি নেই।",
              "একটি কনডম ৫০০ বারেরও বেশি ব্যবহার করা যায়।",
              "এই কনডমটি সব লিঙ্গের মানুষ ব্যবহার করতে পারে।",
            ].map((item, index) => (
              <li key={index} className="flex items-center text-lg">
                <svg
                  className="w-6 h-6 mr-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="text-xl py-6 px-10"
            >
              <Link href="#order-form">অর্ডার করুন এখন</Link>
            </Button>
          </div>
        </section>

        {/* Video Section */}
        <section>
          <div className="aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/P2gW89OxtJY?si=vw-kbKkYT2MSjon8"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-6 text-center text-xl">
            আমাদের ম্যাজিক কনডম সম্পর্কে আরও জানুন এবং এর অসাধারণ সুবিধাগুলি
            দেখুন।
          </p>
        </section>

        {/* Order Form Section */}
        {homePageProduct ? (
          <section
            id="order-form"
            className="bg-card text-card-foreground rounded-3xl p-12 md:p-20 shadow-lg mb-24"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">অর্ডার ফর্ম</h2>
            <div className="flex flex-col md:flex-row gap-12 mb-5"> {/* Added mb-5 here for 20px bottom margin */}
              {/* Left side - Form fields */}
              <div className="md:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      নাম
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার নাম লিখুনঃ"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ঠিকানা
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার ঠিকানা লিখুনঃ"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ফোন নাম্বার
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার ফোন নাম্বার লিখুনঃ"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        অর্ডার প্রক্রিয়াধীন...
                      </>
                    ) : (
                      "অর্ডার করুন"
                    )}
                  </Button>
                </form>
              </div>
              {/* Right side - Product details */}
              <div className="md:w-1/2">     
                <div className="flex flex-col">
                  <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-1/1 aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={homeProductImgSrc}
                        alt={homePageProduct.name}
                        width={100}
                        height={100}
                        className="rounded-lg mb-4"
                        onError={() =>
                          setHomeProductImgSrc("/images/placeholder.png")
                        }
                      />
                    </div>
                    <div className="w-2/3">
                      <h3 className="text-xl font-semibold">
                        {homePageProduct.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 mb-4 line-clamp-3">{homePageProduct.description}</p>
                    <p className="text-gray-600">
                      ক্যাটাগরি: {homePageProduct.category}
                    </p>
                    <p className="text-xl font-bold">
                      মূল্য: {formatCurrency(homePageProduct.price)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="quantity" className="font-medium">
                        পরিমাণ:
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-20 pr-8"
                          style={{
                            WebkitAppearance: 'textfield',
                            MozAppearance: 'textfield',
                            appearance: 'textfield',
                          }}
                        />
                        <style jsx>{`
                          input[type="number"]::-webkit-inner-spin-button,
                          input[type="number"]::-webkit-outer-spin-button {
                            opacity: 1;
                            background: transparent;
                            border-width: 0px;
                            margin: 0;
                            position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            width: 1.5em;
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section
            id="order-form"
            className="bg-card text-card-foreground rounded-3xl p-12 md:p-20 shadow-lg mb-24"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">
              No Product Available
            </h2>
            <p className="text-center text-lg mb-5"> {/* Added mb-5 here for 20px bottom margin */}
              Sorry, there is currently no product available for order. Please
              check back later.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
