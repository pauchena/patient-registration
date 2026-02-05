<?php

namespace Tests\Unit;

use App\Models\Patient;
use PHPUnit\Framework\TestCase;

class PatientModelTest extends TestCase
{

    public function test_patient_model_can_be_created(): void
    {
        $patient = new Patient([
            'full_name' => 'John Doe',
            'email' => 'john@gmail.com',
            'phone_country_code' => '+1',
            'phone_number' => '1234567890',
            'document_photo_path' => 'documents/photo.jpg',
        ]);

        $this->assertInstanceOf(Patient::class, $patient);
        $this->assertEquals('John Doe', $patient->full_name);
        $this->assertEquals('john@gmail.com', $patient->email);
    }


    public function test_patient_fillable_attributes(): void
    {
        $patient = new Patient();
        $expected = [
            'full_name',
            'email',
            'phone_country_code',
            'phone_number',
            'document_photo_path',
        ];

        $this->assertEquals($expected, $patient->getFillable());
    }


    public function test_patient_get_document_photo_url_attribute(): void
    {
        $patient = new Patient([
            'document_photo_path' => 'documents/test.jpg',
        ]);

        $this->assertEquals('/storage/documents/test.jpg', $patient->document_photo_url);
    }


    public function test_patient_date_casts(): void
    {
        $patient = new Patient();
        $casts = $patient->getCasts();

        $this->assertArrayHasKey('created_at', $casts);
        $this->assertArrayHasKey('updated_at', $casts);
        $this->assertEquals('datetime', $casts['created_at']);
        $this->assertEquals('datetime', $casts['updated_at']);
    }
}
