import { useEffect, useState, useRef } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import toast from "react-hot-toast";
import OtpModal from "../../components/Delivery/OtpModal";
import CancelModal from "../../components/Delivery/CancelModal";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import Loading from "../../components/Loading";
import type { Order } from "../../types";
import { api, toFrontendOrder } from "../../lib/api";

const ACTIVE_STATUSES = ["Assigned", "Packed", "Out for Delivery"];

export default function DeliveryDashboard() {

    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "completed">("active");
    const [tracking, setTracking] = useState(false);
    const watchIdRef = useRef<number | null>(null);

    // OTP modal
    const [otpModal, setOtpModal] = useState<string | null>(null);
    const [otp, setOtp] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Cancel modal
    const [cancelModal, setCancelModal] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/delivery-partners/orders");
            setAllOrders(data.map(toFrontendOrder));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const orders = allOrders.filter((o) =>
        tab === "active" ? ACTIVE_STATUSES.includes(o.status) : ["Delivered", "Cancelled"].includes(o.status)
    );

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await api.patch(`/delivery-partners/orders/${orderId}/status`, { status });
            setAllOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
            toast.success(`Order marked as "${status}"`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update order status");
        }
    };

    const handleComplete = async () => {
        if (!otpModal || !otp) return;
        setSubmitting(true);
        try {
            await api.post(`/delivery-partners/orders/${otpModal}/deliver`, { otp });
            setAllOrders((prev) => prev.map((o) => (o._id === otpModal ? { ...o, status: "Delivered" } : o)));
            toast.success("Delivery confirmed!");
            setOtpModal(null);
            setOtp("");
        } catch (err) {
            console.error(err);
            toast.error("Incorrect OTP or update failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setSubmitting(true);
        try {
            await api.patch(`/delivery-partners/orders/${cancelModal}/status`, { status: "Cancelled", reason: cancelReason });
            setAllOrders((prev) => prev.map((o) => (o._id === cancelModal ? { ...o, status: "Cancelled" } : o)));
            toast.success("Order cancelled");
            setCancelModal(null);
            setCancelReason("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to cancel order");
        } finally {
            setSubmitting(false);
        }
    }

    // While "Sharing Location" is on, push this device's position to every active order
    useEffect(() => {
        if (!tracking || !navigator.geolocation) return;

        const pushLocation = (position: GeolocationPosition) => {
            const { latitude: lat, longitude: lng } = position.coords;
            allOrders
                .filter((o) => ACTIVE_STATUSES.includes(o.status))
                .forEach((o) => {
                    api.patch(`/delivery-partners/orders/${o._id}/location`, { lat, lng }).catch((err) => console.error(err));
                });
        };

        watchIdRef.current = navigator.geolocation.watchPosition(pushLocation, (err) => {
            console.error(err);
            toast.error("Couldn't access location");
            setTracking(false);
        }, { enableHighAccuracy: true, maximumAge: 5000 });

        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracking]);

    return (
        <div className="space-y-6">
            {/* Tabs + Tracking toggle */}
            <div className="flex items-center gap-2 flex-wrap">
                {(["active", "completed"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${tab === t ? "bg-app-green text-white" : "bg-white text-zinc-600 hover:bg-app-cream border border-app-border"}`}>
                        {t === "active" ? "Active" : "Completed"}
                    </button>
                ))}
                <div className="ml-auto">
                    <button onClick={() => setTracking((prev) => !prev)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${tracking ? "bg-green-600 text-white" : "bg-white text-zinc-600 border border-app-border hover:bg-app-cream"}`}>
                        <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`} />
                        {tracking ? "Sharing Location" : "Share Location"}
                    </button>
                </div>
            </div>

            {/* Orders */}
            {loading ? (
                <Loading />
            ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
                    <PackageIcon className="size-12 text-app-border mx-auto mb-3" />
                    <p className="text-lg font-semibold text-zinc-900 mb-1">No {tab} deliveries</p>
                    <p className="text-sm text-zinc-500">{tab === "active" ? "You'll see new assignments here" : "Completed deliveries will appear here"}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => <DeliveryOrderCard key={order._id} order={order} tab={tab} handleUpdateStatus={handleUpdateStatus} setOtpModal={setOtpModal} setCancelModal={setCancelModal} />)}
                </div>
            )}

            {/* OTP Modal */}
            {otpModal && <OtpModal setOtpModal={setOtpModal} otp={otp} setOtp={setOtp} handleComplete={handleComplete} submitting={submitting} />}
            {/* Cancel Modal */}
            {cancelModal && <CancelModal setCancelModal={setCancelModal} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancel={handleCancel} submitting={submitting} />}
        </div>
    );
}
