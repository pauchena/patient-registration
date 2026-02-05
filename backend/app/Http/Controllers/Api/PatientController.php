<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Http\Requests\StorePatientRequest;
use App\Notifications\PatientRegisteredNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $patients->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'full_name' => $patient->full_name,
                    'email' => $patient->email,
                    'phone_country_code' => $patient->phone_country_code,
                    'phone_number' => $patient->phone_number,
                    'document_photo_url' => $patient->document_photo_url,
                    'created_at' => $patient->created_at->toIso8601String(),
                ];
            }),
        ]);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('document_photo')) {
                $file = $request->file('document_photo');
                $path = $file->store('documents', 'public');
                $validated['document_photo_path'] = $path;
            }

            $patient = Patient::create($validated);
            $patient->notify(new PatientRegisteredNotification());

            return response()->json([
                'success' => true,
                'message' => 'Patient registered successfully',
                'data' => [
                    'id' => $patient->id,
                    'full_name' => $patient->full_name,
                    'email' => $patient->email,
                    'phone_country_code' => $patient->phone_country_code,
                    'phone_number' => $patient->phone_number,
                    'document_photo_url' => $patient->document_photo_url,
                    'created_at' => $patient->created_at->toIso8601String(),
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Patient registration failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to register patient',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'email' => $patient->email,
                'phone_country_code' => $patient->phone_country_code,
                'phone_number' => $patient->phone_number,
                'document_photo_url' => $patient->document_photo_url,
                'created_at' => $patient->created_at->toIso8601String(),
            ],
        ]);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        try {
            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Patient deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Patient deletion failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete patient',
            ], 500);
        }
    }
}
