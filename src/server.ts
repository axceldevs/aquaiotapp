import { app } from "./app";
import { EnvConfig } from "./config/EnvConfig";

const PORT = EnvConfig.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});