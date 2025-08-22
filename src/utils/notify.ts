import {ElNotification} from 'element-plus';

const baseConfig = {
    duration: 3000,
    position: 'bottom-right'
} as const;

export const Notify = {
    success: (message: string) => {
        ElNotification({...baseConfig, title: '成功', message, type: 'success'});
    },
    error: (message: string) => {
        ElNotification({...baseConfig, title: '错误', message, type: 'error'});
    },
    warning: (message: string) => {
        ElNotification({...baseConfig, title: '警告', message, type: 'warning'});
    },
    info: (message: string) => {
        ElNotification({...baseConfig, title: '提示', message, type: 'info'});
    }
};
