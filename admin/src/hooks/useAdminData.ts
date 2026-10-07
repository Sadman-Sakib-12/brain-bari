"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { adminStore } from "@/lib/store";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const backendOrders = await adminApi.getAllOrders();
      if (backendOrders && backendOrders.length > 0) {
        return backendOrders;
      }
      return adminStore.getOrders();
    },
    initialData: adminStore.getOrders(),
  });
}

export function useAdminConsultations() {
  return useQuery({
    queryKey: ["admin-consultations"],
    queryFn: async () => {
      const backendBookings = await adminApi.getAllBookings();
      if (backendBookings && backendBookings.length > 0) {
        return backendBookings;
      }
      return adminStore.getConsultations();
    },
    initialData: adminStore.getConsultations(),
  });
}

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const backendServices = await adminApi.getServices();
      if (backendServices && backendServices.length > 0) {
        return backendServices;
      }
      return adminStore.getServices();
    },
    initialData: adminStore.getServices(),
  });
}

export function useAdminChatbots() {
  return useQuery({
    queryKey: ["admin-chatbots"],
    queryFn: async () => {
      const backendChatbots = await adminApi.getChatbots();
      if (backendChatbots && backendChatbots.length > 0) {
        return backendChatbots;
      }
      return adminStore.getChatbots();
    },
    initialData: adminStore.getChatbots(),
  });
}

export function useUpdateOrderQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quotedPrice, status }: { id: string; quotedPrice: number; status: string }) => {
      // 1. Try backend
      try {
        await adminApi.updateOrderQuote(id, { quotedPrice, status });
      } catch (e) {
        console.warn("Backend order quote update fallback:", e);
      }

      // 2. Local store update
      const currentOrders = adminStore.getOrders();
      const updated = currentOrders.map((ord: any) =>
        ord.id === id ? { ...ord, quotedPrice, status } : ord
      );
      adminStore.setOrders(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        await adminApi.updateBookingStatus(id, status);
      } catch (e) {
        console.warn("Backend booking status update fallback:", e);
      }

      const current = adminStore.getConsultations();
      const updated = current.map((b: any) =>
        b.id === id ? { ...b, status } : b
      );
      adminStore.setConsultations(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultations"] });
    },
  });
}
