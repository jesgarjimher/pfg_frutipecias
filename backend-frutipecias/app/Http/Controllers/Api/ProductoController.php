<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Alergeno;
use App\Models\InformacionNutricional;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listAll()
    {
        $productos = Producto::with(["categoria", "informacionNutricional", "alergenos"])->get();
        return response()->json($productos);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function getProduct($id) {
        $producto = Producto::with(["categoria","informacionNutricional","alergenos"])->find($id);

        if(!$producto) {
            return response()->json(["message" => "Producto no encontrado"], 404);
        }
        return response()->json($producto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        // Usamos una transacción para asegurarnos de que se guarde todo o nada
        DB::beginTransaction();

        try {
            
            $producto->update([
                'nombre'       => $request->nombre,
                'descripcion'  => $request->descripcion,
                'ingredientes' => $request->ingredientes,
                'nutriscore'   => $request->nutriscore,
                'categoria_id' => $request->categoria_id,
            ]);

            //info nutricional
            if ($request->has('informacion_nutricional')) {
                $producto->informacionNutricional()->updateOrCreate(
                    ['producto_id' => $id],
                    $request->input('informacion_nutricional')
                );
            }

            //alergenos
            if ($request->has('alergenos')) {
                //
                $producto->alergenos()->sync($request->input('alergenos'));
            } else {
                //vaciar tabla intermediaria si no recibe ninguno
                $producto->alergenos()->detach();
            }

            DB::commit();
            return response()->json(['message' => 'Producto actualizado con éxito'], 200);

           } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Error al actualizar',
                    'error' => $e->getMessage()
                ], 500)
                ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                ->header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS, DELETE');
            }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $producto = Producto::find($id);

        if(!$producto) {
            return response()->json(["message" => "No se ha podido encontrar el producto"], 404);
        }

        $producto->delete();

        return response()->json(["message" => "Producto con ID {$id} eliminado"], 200);
    }



    
}
