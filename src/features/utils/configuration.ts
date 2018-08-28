'use strict';

import {
    workspace
} from "vscode";

export class Configuration {
    public static loadAnySetting<T>(
        configSection: string, defaultValue: T, header: string = "restructuredtext"
    ): T {
        return workspace.getConfiguration(header, null).get(configSection, defaultValue);
    }

    public static saveAnySetting<T>(
        configSection: string, value: T, header: string = "restructuredtext"
    ) {
        var old = workspace.getConfiguration(header, null).get(configSection);
        if (value == old)
        {
            return;
        }
        
        workspace.getConfiguration(header, null).update(configSection, value);
    }

    public static loadSetting(
        configSection: string, defaultValue: string, header: string = "restructuredtext", expand: boolean = true
    ): string {
        var result = this.loadAnySetting<string>(configSection, defaultValue, header);
        if (expand && result != null) {
            return this.expandMacro(result);
        }
        return result;
    }

    public static saveSetting(
        configSection: string, defaultValue: string, header: string = "restructuredtext"
    ) {
        this.saveAnySetting<string>(configSection, defaultValue, header);
    }

    public static setRoot() {
        var old = this.loadSetting("workspaceRoot", null);
        if (old.indexOf("${workspaceRoot}") > -1) {
            this.saveSetting("workspaceRoot", this.expandMacro(old));
        }
    }

    private static expandMacro(input: string): string {
        let root = workspace.rootPath;
        return input.replace("${workspaceRoot}", root);
    }
}