import { readFileSync } from "fs";

const configData = readFileSync('config/config.json', 'utf8');

const config = JSON.parse(configData);

export default {
    config
};