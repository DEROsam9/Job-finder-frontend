<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Applications</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalApplications }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-book text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium"> </span>
            <span class="text-muted-color">since last visit:{{ totalApplications }}</span>
        </div>
    </div>
    <!-- <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Revenue</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">%52+ </span>
            <span class="text-muted-color">since last week</span>
        </div>
    </div> -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Clients</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalClients }}</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-muted-color">newly registered:</span>
            <span class="text-primary font-medium">{{ totalClients }} </span>

        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Payments</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalPayments }}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-muted-color">since last week</span>
            <span class="text-primary font-medium">{{ totalPayments }}</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4"></span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl"></div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <!-- <i class="pi pi-comment text-purple-500 !text-xl"></i> -->
                </div>
            </div>
            <span class="text-primary font-medium"> </span>
            <span class="text-muted-color"></span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      totalApplications: 0,
      totalClients: 0,
      totalPayments: 0
    };
  },
  mounted() {
    this.fetchApplicationsCount();
    this.fetchClientsCount();
    this.fetchPaymentsCount();
  },
  methods: {
    fetchApplicationsCount() {
      axios.get('http://localhost:8000/api/v1/applications/count')
  .then(response => {
    this.totalApplications = response.data.total;
  });

    },
    fetchClientsCount() {
      axios.get('http://localhost:8000/api/v1/clients/count')
  .then(response => {
    this.totalClients = response.data.total;
  });

    },
    fetchPaymentsCount() {
      axios.get('http://localhost:8000/api/v1/payments/count')
  .then(response => {
    this.totalPayments = response.data.total;
  });

    }
  }
};
</script>
