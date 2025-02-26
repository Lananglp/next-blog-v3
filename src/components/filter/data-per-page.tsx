import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'

type ItemType = {
    number: string;
    text: string;
}[];

const defaultItem: ItemType = [
    {number: '10', text: '10 Data'},
    {number: '25', text: '10 Data'},
    {number: '50', text: '10 Data'},
    {number: '100', text: '10 Data'},
    {number: '250', text: '10 Data'},
    {number: '500', text: '10 Data'},
];

type Props = {
    value: number;
    onValueChange: (value: number) => void;
    className?: string
    customItems?: ItemType;
}

function FilterDataPerPage({ value, onValueChange, className, customItems }: Props) {
    return (
        <Select value={value.toString()} onValueChange={(value) => onValueChange(parseInt(value))}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Data per page" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Data per page :</SelectLabel>
                    {customItems && customItems.length > 0 ? customItems.map((i, index) => {
                        return (
                            <SelectItem key={index} value={i.number}>{i.text}</SelectItem>
                        )
                    }) : defaultItem.map((i, index) => {
                        return (
                            <SelectItem key={index} value={i.number}>{i.text}</SelectItem>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default FilterDataPerPage