<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'email' => ['required', 'email', 'max:255', 'unique:patients,email', 'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'],
            'phone_country_code' => ['required', 'string', 'max:10', 'regex:/^\+\d{1,4}$/'],
            'phone_number' => ['required', 'string', 'max:20', 'regex:/^\d+$/'],
            'document_photo' => ['required', 'file', 'mimes:jpg,jpeg', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Full name is required',
            'full_name.regex' => 'Full name should only contain letters and spaces',
            'email.required' => 'Email address is required',
            'email.email' => 'Email address must be valid',
            'email.unique' => 'This email address is already registered',
            'email.regex' => 'Only @gmail.com email addresses are accepted',
            'phone_country_code.required' => 'Country code is required',
            'phone_country_code.regex' => 'Country code must be a valid format (+ followed by 1-4 digits)',
            'phone_number.required' => 'Phone number is required',
            'phone_number.regex' => 'Phone number must contain only digits',
            'document_photo.required' => 'Document photo is required',
            'document_photo.mimes' => 'Document photo must be a JPG image',
            'document_photo.max' => 'Document photo must not exceed 10MB',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
