from flask import jsonify
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError
import traceback
import sys

def handle_400(error):
    """Handle bad request errors"""
    return jsonify({
        "status": "error",
        "message": "Bad request",
        "error": str(error)
    }), 400

def handle_401(error):
    """Handle unauthorized errors"""
    return jsonify({
        "status": "error",
        "message": "Unauthorized access"
    }), 401

def handle_403(error):
    """Handle forbidden errors"""
    return jsonify({
        "status": "error",
        "message": "Forbidden - You don't have permission to access this resource"
    }), 403

def handle_404(error):
    """Handle not found errors"""
    return jsonify({
        "status": "error",
        "message": "Resource not found"
    }), 404

def handle_500(error):
    """Handle internal server errors"""
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "error": str(error) if hasattr(error, 'description') else "An unexpected error occurred"
    }), 500

def handle_validation_error(error):
    """Handle validation and other exceptions"""
    if isinstance(error, HTTPException):
        return jsonify({
            "status": "error",
            "message": error.description
        }), error.code

    if isinstance(error, SQLAlchemyError):
        return jsonify({
            "status": "error",
            "message": f"Database error: {str(error)}"
        }), 500

    if isinstance(error, ValueError):
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400

    # Print traceback to terminal for debugging
    print("!!! BACKEND ERROR DETECTED !!!", file=sys.stderr)
    traceback.print_exc()

    return jsonify({
        "status": "error",
        "message": f"Server error: {str(error)}",
        "error": str(error)
    }), 500
