import * as fs from "fs";
import * as path from "path";

interface DeviceItem {
    id: number;
    name: string;
    did: string;
}

type DeviceMap = Record<string, DeviceItem>;

class DeviceManager {
    private filePath: string;
    private data: DeviceMap = {};

    constructor(fileName: string = "devices.json") {
        this.filePath = path.resolve(fileName);
        this.load();
    }

    // 读取文件
    private load(): void {
        if (!fs.existsSync(this.filePath)) {
            this.data = {};
            return;
        }

        const content = fs.readFileSync(this.filePath, "utf-8").trim();
        this.data = content ? JSON.parse(content) : {};
    }

    // 保存文件
    private save(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    }

    // 获取下一个自增 ID
    private getNextId(): number {
        const ids = Object.values(this.data)
            .map(item => item.id)
            .filter(id => typeof id === "number" && !isNaN(id));

        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    // 查全部
    getAll(): DeviceItem[] {
        return Object.values(this.data);
    }

    // 按 ID 查
    getById(id: number): DeviceItem | undefined {
        return Object.values(this.data).find(item => item.id === id);
    }

    // 按 name 查第一条
    getByName(name: string): DeviceItem | undefined {
        return Object.values(this.data).find(item => item.name === name);
    }

    // 按 name 查全部
    getAllByName(name: string): DeviceItem[] {
        return Object.values(this.data).filter(item => item.name === name);
    }

    // 按 did 查
    getByDid(did: string): DeviceItem | undefined {
        return Object.values(this.data).find(item => item.did === did);
    }

    // 新增：ID 自动递增
    add(name: string, did: string): DeviceItem {
        const newId = this.getNextId();

        const newItem: DeviceItem = {
            id: newId,
            name,
            did,
        };

        // 顶层 key 直接用 id
        this.data[String(newId)] = newItem;
        this.save();

        return newItem;
    }

    // 按 ID 局部修改
    updateById(id: number, partial: Partial<Omit<DeviceItem, "id">>): boolean {
        const entry = Object.entries(this.data).find(([_, item]) => item.id === id);

        if (!entry) {
            console.log(`id=${id} 不存在，修改失败`);
            return false;
        }

        const [key, item] = entry;

        this.data[key] = {
            ...item,
            ...partial,
            id: item.id, // 禁止修改 id
        };

        this.save();
        return true;
    }

    // 按 ID 删除
    deleteById(id: number): boolean {
        const entry = Object.entries(this.data).find(([_, item]) => item.id === id);

        if (!entry) {
            console.log(`id=${id} 不存在，删除失败`);
            return false;
        }

        const [key] = entry;
        delete this.data[key];
        this.save();
        return true;
    }
}
export {
 DeviceManager
};