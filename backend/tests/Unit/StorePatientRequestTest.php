<?php

namespace Tests\Unit;

use App\Http\Requests\StorePatientRequest;
use PHPUnit\Framework\TestCase;

class StorePatientRequestTest extends TestCase
{
 
    public function test_request_has_correct_rules(): void
    {
        $request = new StorePatientRequest();
        $rules = $request->rules();

        $this->assertArrayHasKey('full_name', $rules);
        $this->assertArrayHasKey('email', $rules);
        $this->assertArrayHasKey('phone_country_code', $rules);
        $this->assertArrayHasKey('phone_number', $rules);
        $this->assertArrayHasKey('document_photo', $rules);
    }

  
    public function test_full_name_is_required(): void
    {
        $request = new StorePatientRequest();
        $rules = $request->rules();

        $this->assertIsArray($rules['full_name']);
        $this->assertContains('required', $rules['full_name']);
    }

  
    public function test_email_is_required_and_valid(): void
    {
        $request = new StorePatientRequest();
        $rules = $request->rules();

        $this->assertIsArray($rules['email']);
        $this->assertContains('required', $rules['email']);
        $this->assertContains('email', $rules['email']);
    }

  
    public function test_phone_number_is_required(): void
    {
        $request = new StorePatientRequest();
        $rules = $request->rules();

        $this->assertIsArray($rules['phone_number']);
        $this->assertContains('required', $rules['phone_number']);
    }

  
    public function test_document_photo_is_required(): void
    {
        $request = new StorePatientRequest();
        $rules = $request->rules();

        $this->assertIsArray($rules['document_photo']);
        $this->assertContains('required', $rules['document_photo']);
    }
}
