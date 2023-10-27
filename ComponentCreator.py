"""DOCS: setup a new component with an optional route."""
import argparse
import os

parser = argparse.ArgumentParser(
    description="", formatter_class=argparse.ArgumentDefaultsHelpFormatter
)

parser.add_argument(
    "--add-route",
    help="add the specified route path to the router. Must write a route as value.",
)
parser.add_argument("name", type=str, help="Define the name of the component")

args = parser.parse_args()
config = vars(args)

COMPONENTS_LOCATION = "./src/components/"
COMPONENTS_EASY_LOCATION = "@/components"
VIEWS_LOCATION = "./src/views/examples"
VIEWS_EASY_LOCATION = "@/views/examples"
COMPONENTS_EXPORT_LOCATION = "./src/components/index.ts"
ROUTER_LOCATION = "./src/router/index.ts"

component_name = config.get("name")

component_file = f"{COMPONENTS_LOCATION}{component_name}/{component_name}.vue"
component_example_file = f"{VIEWS_LOCATION}/{component_name}/{component_name}Example.vue"
component_easy_example_file = f"{VIEWS_EASY_LOCATION}/{component_name}/{component_name}Example.vue"
component_import_file = f"{COMPONENTS_EASY_LOCATION}/{component_name}/{component_name}.vue"
component_export_file = f"{COMPONENTS_LOCATION}{component_name}/index.ts"
# CREATE THE COMPONENT FILE
os.makedirs(os.path.dirname(component_file), exist_ok=True)
with open(component_file, "w", encoding="UTF-8") as file:
    lines_to_write = """<template>
    <div>
    </div>
</template>

<script lang="ts" setup>

</script>
"""
    file.writelines(lines_to_write)

# CREATE THE COMPONENT EXPORT FILE
with open(component_export_file, "w", encoding="UTF-8") as file:
    lines_to_write = f"""import {component_name} from "./{component_name}.vue";

export {{ {component_name} }};
export default {component_name};
"""
    file.writelines(lines_to_write)

# CREATE THE COMPONENT EXAMPLE FILE
os.makedirs(os.path.dirname(component_example_file), exist_ok=True)
with open(component_example_file, "w", encoding="UTF-8") as file:
    lines_to_write = f"""<template>
    <{component_name}>
    </{component_name}>
</template>

<script lang="ts" setup>
import {component_name} from "{component_import_file}";
</script>
"""
    file.writelines(lines_to_write)

import_lines_to_write = f"""import {{ {component_name} }} from "./{component_name}";\n
"""
with open(COMPONENTS_EXPORT_LOCATION, "r", encoding="UTF-8") as file_reader:
    lines = file_reader.readlines()

    with open(COMPONENTS_EXPORT_LOCATION, "w", encoding="UTF-8") as file_writer:
        for line in lines:
            if line.strip("\n").strip().startswith('export') is False:
                file_writer.write(line)
            else:
                file_writer.writelines(import_lines_to_write)
                file_writer.write(line)

export_lines_to_write = f", {component_name} }}"
with open(COMPONENTS_EXPORT_LOCATION, "r", encoding="UTF-8") as file_reader:
    lines = file_reader.readlines()

    with open(COMPONENTS_EXPORT_LOCATION, "w", encoding="UTF-8") as file_writer:
        for line in lines:
            if line.strip("\n").strip().startswith('export'):
                file_writer.write(line.replace(" }", export_lines_to_write))
            else:
                file_writer.write(line)

# ADD ROUTER ENTRY IF THE OPTION IS TRUE
if config.get("add_route"):
    router_lines_to_write = f"""{{
    path: "/{component_name}",
    name: "{component_name}",
    component: () =>
    import(
        "{component_easy_example_file}"
    )
}},
"""

    with open(ROUTER_LOCATION, "r", encoding="UTF-8") as file_reader:
        lines = file_reader.readlines()

        with open(ROUTER_LOCATION, "w", encoding="UTF-8") as file_writer:
            for line in lines:
                if line.strip("\n").strip() != '];':
                    file_writer.write(line)
                else:
                    file_writer.writelines(router_lines_to_write)
                    file_writer.write(line)