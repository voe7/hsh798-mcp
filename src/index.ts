import {StdioServerTransport,server} from "./mcp/main.js"


// 启动 stdio transport
!(async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
})();