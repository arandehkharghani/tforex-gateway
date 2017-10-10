import * as api from '../../api';

export class StartupService {
    public static startup() {
        setTimeout(async () => {
            let service = new api.services.UserService();
            await service.setupSupreAdminUsers();
        }, 5000);
    }
}
StartupService.startup();