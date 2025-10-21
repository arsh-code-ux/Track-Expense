import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const DataSyncContext = createContext();

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
};

// Safe localStorage helper
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3005'}/api`;

export const DataSyncProvider = ({ children }) => {
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Central function to trigger data refresh across all components
  const triggerDataSync = useCallback(() => {
    console.log('🔄 Data sync triggered at:', new Date().toLocaleTimeString());
    setSyncTrigger(prev => prev + 1);
    setLastSyncTime(new Date());
  }, []);

  // Function to refresh specific data types
  const refreshData = useCallback(async (dataTypes = ['all']) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('📊 Refreshing data types:', dataTypes);

      if (dataTypes.includes('all') || dataTypes.includes('transactions')) {
        // This will trigger all transaction-dependent components to reload
        triggerDataSync();
      }

      if (dataTypes.includes('all') || dataTypes.includes('alerts')) {
        // Trigger alert recalculation
        await axios.get(`${API_BASE_URL}/alerts`, { headers });
      }

      if (dataTypes.includes('all') || dataTypes.includes('budgets')) {
        // Refresh budget calculations
        await axios.get(`${API_BASE_URL}/budgets`, { headers });
      }

      if (dataTypes.includes('all') || dataTypes.includes('savings')) {
        // Refresh savings goals
        await axios.get(`${API_BASE_URL}/savings-goals`, { headers });
      }

    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [triggerDataSync]);

  // Transaction operations with automatic sync
  const transactionOperations = {
    add: async (transactionData) => {
      try {
        const token = getToken();
        const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Transaction added, triggering sync...');
        await refreshData(['all']);
        return response.data;
      } catch (error) {
        console.error('❌ Error adding transaction:', error);
        throw error;
      }
    },

    update: async (id, transactionData) => {
      try {
        const token = getToken();
        const response = await axios.put(`${API_BASE_URL}/transactions/${id}`, transactionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Transaction updated, triggering sync...');
        await refreshData(['all']);
        return response.data;
      } catch (error) {
        console.error('❌ Error updating transaction:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const token = getToken();
        const response = await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Transaction deleted, triggering sync...');
        await refreshData(['all']);
        return response.data;
      } catch (error) {
        console.error('❌ Error deleting transaction:', error);
        throw error;
      }
    }
  };

  // Budget operations with sync
  const budgetOperations = {
    add: async (budgetData) => {
      try {
        const token = getToken();
        const response = await axios.post(`${API_BASE_URL}/budgets`, budgetData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Budget added, triggering sync...');
        await refreshData(['budgets', 'alerts']);
        return response.data;
      } catch (error) {
        console.error('❌ Error adding budget:', error);
        throw error;
      }
    },

    update: async (id, budgetData) => {
      try {
        const token = getToken();
        const response = await axios.put(`${API_BASE_URL}/budgets/${id}`, budgetData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Budget updated, triggering sync...');
        await refreshData(['budgets', 'alerts']);
        return response.data;
      } catch (error) {
        console.error('❌ Error updating budget:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const token = getToken();
        const response = await axios.delete(`${API_BASE_URL}/budgets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Budget deleted, triggering sync...');
        await refreshData(['budgets', 'alerts']);
        return response.data;
      } catch (error) {
        console.error('❌ Error deleting budget:', error);
        throw error;
      }
    }
  };

  const value = {
    syncTrigger,
    isLoading,
    lastSyncTime,
    triggerDataSync,
    refreshData,
    transactionOperations,
    budgetOperations
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};