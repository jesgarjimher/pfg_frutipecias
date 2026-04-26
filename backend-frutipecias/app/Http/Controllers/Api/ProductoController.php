<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Alergeno;
use App\Models\InformacionNutricional;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listAll(Request $request)
    {
        $query = Producto::with(["categoria", "informacionNutricional", "alergenos"]);
        if($request->has("categoria")) {
            $query->whereHas("categoria", function($q) use ($request) {
                $q->where("nombre", $request->categoria);
            });
        }

        if($request->has("search")) {
            $busqueda = $request->search;
            $query->where('nombre', 'LIKE', "%{$busqueda}%");
        }

        $productos = $query->paginate(10);
        return response()->json($productos);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createProducto(Request $request)
    {
        $request->validate([
            "nombre"=>"required|string|max:255",
            "categoria_id" => "required|exists:categorias,id",
            "nutriscore" => "required|string|max:1",
            "imagen" => "nullable|image|mimes:jpeg,png,jpg|max:2048"
        ]);

        DB::beginTransaction();

        try{
           $data = [
            "nombre" => $request->nombre,
            "descripcion" => $request->descripcion,
            "ingredientes" => $request->ingredientes,
            "nutriscore" => $request->nutriscore,
            "categoria_id" => $request->categoria_id,
           ];

           //si se recibe imagen
            if($request->hasFile("imagen")) {
                $path = $request->file("imagen")->store("productos", "public");
                $data["imagen"] = $path;
            }

            $producto = Producto::create($data);

           //crea relacion informacion_nutricional con relaicon hasOne
           if($request->has("informacion_nutricional")) {
            $info = json_decode($request->input("informacion_nutricional"), true);
            $producto->informacionNutricional()->create($info);
           }

           //
           if($request->has("alergenos")) {
                $alergenosIds = json_decode($request->input("alergenos"), true);
                if (is_array($alergenosIds)) {
                    $producto->alergenos()->attach($alergenosIds);
                }
           }

           DB::commit();

           return response()->json([
            "message" => "Producto creado",
            "id" => $producto->id
           ], 201);
        }catch(\Exception $error) {
            DB::rollBack();
            return response()->json([
                "message" => "Se ha producido un error al crear el producto",
                "error" => $error->getMessage()
            ], 500);
        }
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
            $data = $request->only(["nombre","descripcion","ingredientes","nutriscore","categoria_id"]);
            
            //si ya habia imagen se borra
            if($request->hasFile("imagen")) {
                if($producto->imagen) {
                    Storage::disk("public")->delete($producto->imagen);
                }
                $path = $request->file("imagen")->store("productos", "public");
                $data["imagen"] = $path;
            }
            $producto->update($data);


            if ($request->has("informacion_nutricional")) {
                $infoNutricional = json_decode($request->input("informacion_nutricional"), true);
                $producto->informacionNutricional()->updateOrCreate(
                    ["producto_id" => $id],
                    $infoNutricional
                );
            }

            if ($request->has("alergenos")) {
                $alergenosIds = json_decode($request->input("alergenos"), true);
                $producto->alergenos()->sync($alergenosIds);
            }else {
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

        DB::beginTransaction();
        try {
            $pathImagen = $producto->imagen;
            $producto->delete();

            if($pathImagen) {
                Storage::disk("public")->delete($pathImagen);
            }
            DB::commit();
            return response()->json(["message" => "Producto eliminado"], 200);

        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => "Error al eliminar el producto", "error" => $e->getMessage()], 500);
        }
        
    }



    
}
