import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { carsAPI } from '../utils/api'
import { ArrowLeft, Users, Zap, Fuel, Gauge, Heart, Share2, MapPin, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CarDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carsAPI.getById(slug)
        const carData = res.data?.data || res.data
        setCar(carData)
        setMainImage(carData.images?.[0] || '')
      } catch (err) {
        toast.error('Car not found')
        navigate('/cars')
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-12 h-12 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!car) return null

  const allPrices = [
    { label: 'Per Day', value: car.pricePerDay, symbol: 'day' },
    ...(car.pricePerWeek ? [{ label: 'Per Week', value: car.pricePerWeek, symbol: 'week' }] : []),
    ...(car.pricePerMonth ? [{ label: 'Per Month', value: car.pricePerMonth, symbol: 'month' }] : []),
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-400/30 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button onClick={() => navigate('/cars')} className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors text-sm">
            <ArrowLeft size={18} /> Back to Fleet
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2 rounded-lg transition-all ${liked ? 'bg-red-500/20 text-red-400' : 'bg-dark-600 text-gray-400 hover:text-brand-gold'}`}>
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => toast.success('Link copied!')} className="p-2 rounded-lg bg-dark-600 text-gray-400 hover:text-brand-gold transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="rounded-2xl overflow-hidden bg-dark-800 h-96 md:h-[500px]">
                <img src={mainImage} alt={car.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === img ? 'border-brand-gold' : 'border-dark-400 hover:border-dark-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Details Tabs */}
            <div className="mt-12 space-y-8">
              {/* Specs */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-brand-gold" size={20} />
                      <span className="text-gray-400 text-sm">Seats</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{car.seats}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="text-brand-gold" size={20} />
                      <span className="text-gray-400 text-sm">Fuel Type</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{car.fuelType}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="text-brand-gold" size={20} />
                      <span className="text-gray-400 text-sm">Transmission</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{car.transmission}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="text-brand-gold" size={20} />
                      <span className="text-gray-400 text-sm">Year</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{car.modelYear}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {car.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-dark-800 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {car.description && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Car</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <div className="card p-8 sticky top-24 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{car.name}</h1>
                <p className="text-brand-gold text-sm font-medium uppercase">{car.category}</p>
              </div>

              {/* Availability Status */}
              <div className={`p-4 rounded-xl ${car.isAvailable ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <p className={`text-sm font-medium ${car.isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                  {car.isAvailable ? '✓ Available Now' : '✗ Currently Booked'}
                </p>
                {car.bookedUntil && (
                  <p className="text-xs text-gray-400 mt-1">Available from {new Date(car.bookedUntil).toLocaleDateString()}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t border-dark-400/30 pt-6">
                <h3 className="text-sm text-gray-400 font-medium mb-4">Pricing</h3>
                <div className="space-y-3">
                  {allPrices.map((price, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{price.label}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">₹{price.value}</span>
                        <span className="text-gray-500 text-xs">/{price.symbol}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-dark-400/30">
                <Link to={`/contact?car=${car.slug}`} className="block btn-gold w-full text-center py-3 font-semibold">
                  Book This Car
                </Link>
                <a href={`https://wa.me/919876543210?text=Hi%20I%20am%20interested%20in%20booking%20${encodeURIComponent(car.name)}`} target="_blank" rel="noopener noreferrer" className="block btn-outline w-full text-center py-3 font-semibold">
                  WhatsApp
                </a>
              </div>

              {/* Info */}
              <div className="p-4 bg-dark-800 rounded-xl text-sm text-gray-400 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-brand-gold mt-0.5" />
                  <span>Delivery available across Kashmir</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-brand-gold mt-0.5" />
                  <span>24/7 Support & Insurance Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
