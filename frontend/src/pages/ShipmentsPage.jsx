import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    ArrowRight,
    Filter,
    Truck,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Box
} from 'lucide-react'
import { shipmentAPI } from '../lib/api'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { getStatusColor, formatDateTime } from '../lib/utils'
import Layout from '../components/Layout'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const ShipmentsPage = () => {
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 })

    useEffect(() => {
        fetchShipments()
    }, [currentPage, statusFilter])

    const fetchShipments = async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10,
                ...(statusFilter !== 'all' && { status: statusFilter })
            }
            const response = await shipmentAPI.getAll(params)
            if (response.data.success) {
                setShipments(response.data.data.shipments)
                setPagination(response.data.data.pagination)
            }
        } catch (err) {
            setError('Failed to load shipments')
            console.error('Fetch shipments error:', err)
        } finally {
            setLoading(false)
        }
    }

    const filteredShipments = shipments.filter(shipment =>
        !searchTerm ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
            case 'Processing':
            case 'Confirmed':
                return <Clock className="h-5 w-5" />
            case 'Delivered':
                return <CheckCircle2 className="h-5 w-5" />
            case 'Cancelled':
                return <AlertCircle className="h-5 w-5" />
            default:
                return <Truck className="h-5 w-5" />
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
            case 'Processing':
            case 'Confirmed':
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
            case 'Delivered':
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'Cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            default:
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        }
    }

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Processing', label: 'Processing' },
        { value: 'In Transit', label: 'In Transit' },
        { value: 'Delivered', label: 'Delivered' },
        { value: 'Cancelled', label: 'Cancelled' }
    ]

    return (
        <Layout>
            <div className="relative min-h-screen bg-background/50 pb-20">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
                            My Shipments
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Track and manage your complete shipment history
                        </p>
                    </motion.div>

                    {/* Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <Card className="backdrop-blur-xl bg-card/50 border-border/50 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Search className="h-5 w-5" />
                                        </div>
                                        <Input
                                            placeholder="Search tracking ID, destination..."
                                            className="pl-10 h-12 bg-background/50 border-white/10 text-base"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full md:w-64">
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                                                <Filter className="h-4 w-4" />
                                            </div>
                                            <Select
                                                value={statusFilter}
                                                onChange={(e) => {
                                                    setStatusFilter(e.target.value)
                                                    setCurrentPage(1)
                                                }}
                                                className="pl-10 h-12 bg-background/50 border-white/10 w-full"
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Content */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <p className="text-muted-foreground animate-pulse">Loading shipments...</p>
                            </div>
                        ) : filteredShipments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <Package className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No shipments found</h3>
                                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                                    We couldn't find any shipments matching your search criteria. Try adjusting your filters.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="space-y-4"
                            >
                                {filteredShipments.map((shipment) => (
                                    <motion.div variants={item} key={shipment._id}>
                                        <Link to={`/track/${shipment.trackingNumber}`}>
                                            <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                        {/* Icon Box */}
                                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-opacity ${getStatusStyle(shipment.status)} border`}>
                                                            {getStatusIcon(shipment.status)}
                                                        </div>

                                                        {/* Main Content */}
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                                                                    <Box className="h-3 w-3" /> Tracking ID
                                                                </p>
                                                                <p className="font-mono font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                                                                    {shipment.trackingNumber}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                                                                    <MapPin className="h-3 w-3" /> Destination
                                                                </p>
                                                                <p className="font-medium truncate text-foreground/90">
                                                                    {shipment.destination}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                                                                    <Calendar className="h-3 w-3" /> Date Created
                                                                </p>
                                                                <p className="text-sm font-medium text-foreground/80">
                                                                    {formatDateTime(shipment.createdAt)}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Status</p>
                                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(shipment.status)}`}>
                                                                    {shipment.status}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Arrow */}
                                                        <div className="hidden md:flex items-center justify-center w-10">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                                <ArrowRight className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-12">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className="h-10 w-10 rounded-full hover:bg-primary/10"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center px-4 font-medium text-sm bg-card/50 backdrop-blur rounded-full h-10 border border-border/50">
                                            Page <span className="text-primary font-bold mx-1">{currentPage}</span> of {pagination.pages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={currentPage === pagination.pages}
                                            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                                            className="h-10 w-10 rounded-full hover:bg-primary/10"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ShipmentsPage
