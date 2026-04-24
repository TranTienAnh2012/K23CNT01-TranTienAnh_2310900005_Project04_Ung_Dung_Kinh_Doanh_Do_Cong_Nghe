import React from 'react';
import NnhClientHeader from '../components/NnhClientHeader';
import NnhClientFooter from '../components/NnhClientFooter';

export default function NnhBlog() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <NnhClientHeader />
      
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="relative w-full min-h-[600px] flex items-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 opacity-60">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD11qQ8aNV3ZthL6sNiONNaTi3GxE78bnz7-cQS7IEd44LdM4r4-t3Ecs8vJDmg4j37eXYDBLxc5PUwq5b0Rl4OvmhtDj5jGRx-FodDkFFfHcoaVJEeo0dC73r1MXzIzBv_7bqNL6VC4H85oH1XaeCxdley4QOysrsS7GFNIHC-dt3CuGjZX22JtYwrnJQETel7W1khiEmc1wdLJMGKvYYcTfY94oAI7eT4fhySt34j0TzMOtPoUs9dSnucHsPzxKMK-nfITDAkuA" 
              alt="Futuristic Smartphone" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/40 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary text-on-secondary font-semibold text-xs tracking-wider uppercase">
                FEATURED INSIGHT
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Space_Grotesk'] leading-tight">
                The Future of Mobile: Beyond the iPhone 17
              </h1>
              <p className="text-[#bec6e0] text-xl mb-10 max-w-lg font-['Inter']">
                Exploring the architectural shifts in neuro-processing and the inevitable transition to ambient computing interfaces.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDYOnDifu0EpixPCHWzDpPtWnQ8ErrS_4UopYKd5LHrAhNnWR0UTqlVuTcdkkOLJJLqz4BR2NyC_yoaOGuwiWzMEQ6Jz5OURT3KaRafMaYg1cEKptH3ZgAwRql6KzmPbu_0vUab5ewbMATYoeRUCbVwcTnZ9vYtfW679PEqPsJTiYv8E5Wk_GVyhx7RTUfaYTksncJUUH_fn1_NB13fl53GzRjVwV5iNHu6Gh5IjMp_BnmHwCCQQVGg8EF8sBLluipxv3lO-McCQ" 
                  alt="Marcus Vance" 
                  className="w-12 h-12 rounded-full border-2 border-secondary object-cover"
                />
                <div>
                  <p className="text-white font-semibold">Marcus Vance</p>
                  <p className="text-[#7c839b] text-sm uppercase tracking-wider">8 MIN READ • TECH ANALYST</p>
                </div>
              </div>
              <button className="bg-secondary text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20">
                READ ARTICLE <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="bg-[#f2f4f6] border-y border-[#c6c6cd]/30 sticky top-16 z-40 backdrop-blur-md bg-white/70">
          <div className="max-w-7xl mx-auto px-6 py-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max gap-8">
              <div className="flex gap-12">
                <a className="text-2xl font-semibold text-primary border-b-2 border-primary font-['Space_Grotesk']" href="#">All Stories</a>
                <a className="text-2xl font-semibold text-[#45464d] hover:text-primary transition-colors font-['Space_Grotesk']" href="#">Product Reviews</a>
                <a className="text-2xl font-semibold text-[#45464d] hover:text-primary transition-colors font-['Space_Grotesk']" href="#">Tech News</a>
                <a className="text-2xl font-semibold text-[#45464d] hover:text-primary transition-colors font-['Space_Grotesk']" href="#">Lifestyle</a>
              </div>
              <div className="flex items-center gap-2 text-[#45464d]">
                <span className="text-sm font-semibold tracking-wider">FILTER BY TAG</span>
                <span className="material-symbols-outlined">filter_list</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary font-['Space_Grotesk']">Trending Now</h2>
              <p className="text-[#45464d]">The most discussed topics in the Zenith ecosystem.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="p-2 border border-[#c6c6cd] rounded-full hover:bg-[#e6e8ea] transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-[#c6c6cd] rounded-full hover:bg-[#e6e8ea] transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trending Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6 shadow-sm border border-[#c6c6cd]/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXbY-wu1GheZqyKzu7jewavBbzBSvwQi_VsigUJo0FcWMs5tyHJ1xAJ_uGnQZun1qS8kUOIXGLb1coCKCBWoyNxy8VKmok_tWUR_3KbI8Cs5X9r9kX9d1y9kO3MlHZVok490D-Cvlo5GvYA5flwB97_OlIAQZFPmYiggD4lLoX9s9XsmClKjtUp1gnOrIFgOUC4QSfblwgTIy65Y5yvFxsBM2N4IjQ5ih_crSz2A7SWYBgEBHGlU6Z7ca5xJF6bx3jQZ1qhmpkXg" 
                  alt="Accessories" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-primary">Lifestyle</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-secondary text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 5 MIN READ
                </span>
                <span className="text-[#45464d] text-sm font-medium">• MAY 12, 2024</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors mb-3 font-['Space_Grotesk']">Top 10 Accessories for the New Season</h3>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e6e8ea] overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsgyrzbzKYgORrFtOoBCOjE8ZM_MVZvVmd8SMClxur4_7YIQo-0NnFLrV9w-drvB9ltGEw2m3E2DXxnw2mZGwG4fZIePGW7bWIwibyJtPZI1kcRX28iLt2IqbYBLkMH-8rCZPBBbD85NnqC__UQ0W5C_66ivGSUYkFc6SqU6foyYL2gO3bm3_VEeybUdYLHGwl0toy4KbbssUMiaaekvgvEDLzuurecPJm1o11lNupP4KMSzrbEsrL4PFvwN-ov2GZhWQ0w1EP1A" alt="Elena Rossi" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium">Elena Rossi</span>
              </div>
            </div>
            {/* Trending Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6 shadow-sm border border-[#c6c6cd]/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlQYxJ3uy5j_XWL-3tMXVO3SwJpk5tfxqt71N2tvzTWcdzrTVi5jF9MsUmB3cNWvc0KAkdaJGfOgg6Tt4B_O6dp06ULpi3YcbRKBO4LfmZTFIZPb8W4GXI0IapjzWiMc1m0cq6UW3rWtpDt3I1iDM4FhtUFzeqeVlMEASHKXLQRdSwpixBi334WXMLCOl_x9DwnwaN6tNecqAE3A1xZ1svq1luPkxqsoa3HxGBZnSZG1QfwDdFNN61KOWtd5eqIK_RmRuq_F-Kmg" 
                  alt="A19 Chip" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-primary">Performance</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-secondary text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 12 MIN READ
                </span>
                <span className="text-[#45464d] text-sm font-medium">• MAY 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors mb-3 font-['Space_Grotesk']">A19 Chip: A Performance Deep Dive</h3>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e6e8ea] overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjRes8eHf1g97Xq74ldDTogsX8FW5J0AXVUV943Mis_p3b6EK1iP50EyvQAbFCP76xA5PR7mvddqIkfD0iaWw8x-4NyrpTPAa84veHglMqUk4ssASb7CVQgyLjAk7q2-NF-aK0DHp0vxpblsp20AoXkcXqPJ-Yex1ST907BVfs-nAl7eRgWxZk4h7yyjKQEorwz0zrdjB8dUdeVGnDphMjQyEjj_f_ADItnJ-xsSC0QoWGwp3JP8iln9EuHAh4S2Y7kzZ-0lilHA" alt="Dr. Simon Chen" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium">Dr. Simon Chen</span>
              </div>
            </div>
            {/* Trending Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6 shadow-sm border border-[#c6c6cd]/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjRyt97485d6_s_EBoWhqMAJ9tAt2ap0uj4t3K9-qh5Q0yA3HxfuFX5PodFIRdf1cUfEQ10Qe_-wNuC4_TqvmHXB2yGaOqfQ1a_S9mzl71xa9gd5P9Q1MXcN_1wDwY8CaG_nVDjXdGofqAHLEG50Kzkh-de_micsK0V2UdhM2FSbhJG3CEGEe3R2Z1jmQnGfebJZY8z9igWEhlzeHyl9dPQC5Zye8KnN9ynDSIjW2xiHijHwb0ClPy3e9GQyGcezyhKaDyAVlApQ" 
                  alt="Sustainability" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-primary">Ethics</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-secondary text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 6 MIN READ
                </span>
                <span className="text-[#45464d] text-sm font-medium">• MAY 08, 2024</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors mb-3 font-['Space_Grotesk']">Sustainability at Zenith: Our 2030 Vision</h3>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#e6e8ea] overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAqQgfbaMMtng6QDbuMPNbgCiSax49mIuvUoR_teJvsjOS6Lc-QdPtDAe7Si3umdoS346Vp1veSa8QNPidMQBWibG_vH5YiNh-KzA1c8t3tRI69xVAKrkzX4ka687YlvuK98GqiMzNI7olX6ubwRUTfbzbFpDM4NKrJwUldmKxJROC64CsbEh_M1T9U2-bCijEhMweuhSp7syoQEUX7wf7yfK9OG97k58mXIyDUSBf6dsgAyn77UUx6-yxbiHMMC2k_VbXTAuxGQ" alt="Sarah Jenkins" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium">Sarah Jenkins</span>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter / Bento Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
            <div className="lg:col-span-8 bg-[#e0e3e5] rounded-3xl p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf2NvQzlPgXTGv-BfDIXOu5ew92AcmzLeTGDp_ZcsLh9nG3HwAYbfnBZ6XiSDqE5CvaeXcRwsmaCpNffc6UxoNkJCbKpRiCJ6OuqbnlnluOUOvhypyw6JffQFAn8VloC1hGXkF87bN8Y8t6MxejlHw7PLk-AlXxzYoFYTcFJwlA6MuHq0kSHKa4yPvVKU8k_CNtNpy3iHw7MzVHGtkI_XzTXJOe1Z2X0Omg9KTuXlT7e55UuXqtfsITPrpD9ntzlkJQPGfeT1xMA" 
                  alt="Abstract Render" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 max-w-lg">
                <h2 className="text-5xl font-bold mb-6 font-['Space_Grotesk']">Stay ahead of the curve.</h2>
                <p className="text-[#45464d] text-lg mb-8">Join 50,000+ tech enthusiasts who receive our weekly deep-dive on innovation, delivered straight to their inbox.</p>
                <form className="flex flex-col md:flex-row gap-4">
                  <input 
                    className="flex-grow bg-white border-none rounded-lg px-6 py-4 focus:ring-2 focus:ring-secondary text-base" 
                    placeholder="Enter your email" 
                    type="email"
                  />
                  <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-secondary transition-colors" type="submit">Subscribe</button>
                </form>
                <p className="mt-4 text-xs text-[#45464d]">By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.</p>
              </div>
            </div>
            <div className="lg:col-span-4 bg-secondary-container text-white rounded-3xl p-12 flex flex-col justify-end">
              <span className="material-symbols-outlined text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="text-3xl font-bold mb-4 leading-tight font-['Space_Grotesk']">Review: The Zenith Vision Pro 2</h3>
              <p className="text-[#fefcff] text-base mb-8">Spatial computing finally finds its feet in our most rigorous testing cycle yet.</p>
              <a className="font-bold text-sm flex items-center gap-2 group" href="#">
                READ REVIEW 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Detailed List Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#c6c6cd]/30">
          <h2 className="text-3xl font-bold mb-12 font-['Space_Grotesk']">Latest Insights</h2>
          <div className="space-y-12">
            {/* Article Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
              <div className="md:col-span-4 aspect-video overflow-hidden rounded-xl bg-[#eceef0]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1qZjNhR01TYGPpQ0px7qnHjnwtWemG99hY87U03ERaLvWWDJ111zG2IBGAR8JXKNbwdjNvbwCEN9gHHXDrhafNw9-1x_RV6W4ZlsqC_9znsDg-H-p46CqCFs1-Ct4wDSQvhcNNvRmycx1E57b3hSyBYLouV4Tnw9SoYdmo-VCxveclhbo3O1Xz9BzugXyEPeCgjyyRAvaqceaXzP2OsFuZ5eqNBz6Keae-5E_0ge5O2iHwDpau-mnnLJ0roaapdpzHLFZ4CjmZA" 
                  alt="Camera Lens" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#e6e8ea] text-[#45464d] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Reviews</span>
                  <span className="text-[#45464d] text-sm">7 MIN READ</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors font-['Space_Grotesk']">The Best Pro Cameras of 2024: A Comparative Review</h3>
                <p className="text-[#45464d] text-base mb-6 line-clamp-2">We put the industry leaders through their paces in various lighting conditions to see who truly wears the crown for professional cinematography.</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e6e8ea] overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0erzpEbOT5QV_FYcfSKXHQpdTSXrdqnIqAQ39v_cfx-TEhBr26lkdRmwBC7ob6xSKPH-ZQYkt3_VRxYIZqvN3PXN3D0HESYTFxYJRlR9XKrNQ5fnlwZhMoRnLLO2cyQRosBhA8yVk-go4UHNrlofiDSKxhB8eRyTwU1P4Q7jEuQUZhricKmvRFjYdOp4FEVhZceJIBkrwSKEVvapLUJpXS_Opb2dLt5DCqW5HHPZyIXMYz6qpXVx3pC1uFoiX5069eZ7kQr3ZVg" alt="David Foster" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">David Foster</span>
                  <span className="text-sm text-[#45464d]">in <span className="font-medium text-primary">Photography</span></span>
                </div>
              </div>
            </div>
            {/* Article Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
              <div className="md:col-span-4 aspect-video overflow-hidden rounded-xl bg-[#eceef0]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdpyPGNLXPgys7ApGAKL4BCtNMtTiTm6o8ojD4UwEAVz5GHhe83hgLuPf1H3SZ2bYXk3zQA_azY9TbRJWiL4Cbi98MSDI-q30N-Y1JMpd6vpIcA11fL13-1eXsyknFHk7ydJ4CwcWCIxQiu0D7L1Ku6E6fx3qE0pgh6oHbrA9_P_yBEyEbBDhFsjyU_b50f67aCD5tU9nWvRTTXnfdOfEWCQzbuIKM_oSyuUWLL3fuGcxFbQTtZasrCO-O9cybcp-AVXnk6vykgA" 
                  alt="Workspace" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#e6e8ea] text-[#45464d] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Lifestyle</span>
                  <span className="text-[#45464d] text-sm">4 MIN READ</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors font-['Space_Grotesk']">The Art of the Minimalist Workspace</h3>
                <p className="text-[#45464d] text-base mb-6 line-clamp-2">How reducing physical clutter can lead to a 30% increase in cognitive focus and creative output. Our design experts share their secrets.</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e6e8ea] overflow-hidden">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9Ii065UCypsWcFssF3r12dioDNREExeIcnotOsBjZmCDUWQgPkS5Dn8VMPDjzS65zi3V0LUNPbk-zJ7SBTCbMZwxKMtXrAENpZzAt1OmqsCaAn6osZheN6J8hO4Y1y_jPkvtgLD8eRJLMc2FaPhXGGcJARxCZembmMHtcS28Xukq9TURCO-rBAnCJ3yhK6nbrcfU00BQs3TQWZunLwmJv_iHWknFRtlkV_1iDYUfs3vxFlSsD8nFGHWNmE-IAATIN0HNG585mCw" alt="Maya Lin" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">Maya Lin</span>
                  <span className="text-sm text-[#45464d]">in <span className="font-medium text-primary">Design</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 flex justify-center">
            <button className="px-10 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all">LOAD MORE INSIGHTS</button>
          </div>
        </section>
      </main>

      <NnhClientFooter />
    </div>
  );
}
