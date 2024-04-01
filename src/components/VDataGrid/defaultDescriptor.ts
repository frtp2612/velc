import { VDataType } from "@/enums";
import { VDataGridDescriptor, VDataRow } from "./types";

export function getDefaultDescriptor<
  RowType extends VDataRow
>(): VDataGridDescriptor<RowType> {
  const descriptor: VDataGridDescriptor<RowType> = {
    getCellBackground: (row, column) => "",
    getCellForeground: (row, column) => "",
    getDataType: (row, column) => VDataType.STRING,
    getValueFormatter: (row, column) => row[column.id],
  };

  return descriptor;
}
