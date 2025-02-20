import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import React from 'react'
import { Controller } from 'react-hook-form'

function InputStatus({ control, name, errors }: { control: any; name: string, errors?: any }) {
  return (
    <Controller
        name={name}
        control={control}
        render={({ field }) => {

            const handleChange = (e: string) => {
                field.onChange(e);
            }

            return (
                <div>
                    <Label htmlFor="status" className="inline-block mb-2">Post Status :</Label>
                    <div>
                        <div className="relative inline-block w-32">
                            <Select {...field} onValueChange={handleChange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue id='status' defaultValue={field.value} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="publish">Publish</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {errors && <p className="mt-2 text-red-500 text-xs">{errors?.message}</p>}
                </div>
            )
        }}
    />
  )
}

export default InputStatus