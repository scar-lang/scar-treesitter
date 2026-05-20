; Comments
(doc_comment) @comment.doc
(line_comment) @comment.line

; Literals
(string) @string
(escape_sequence) @constant.character.escape
(format_specifier) @string.special
(integer_literal) @constant.numeric.integer
(float_literal) @constant.numeric.float
(bool_literal) @constant.builtin.boolean
(none_literal) @constant.builtin

; Keywords
"pub"       @keyword.storage.modifier
"extern"    @keyword.storage.modifier
"def"       @keyword.function
"type"      @keyword.type
"interface" @keyword.type
"typeset"   @keyword.type
"val"       @keyword.storage
"var"       @keyword.storage
"as"        @keyword.operator
"ref"       @keyword.type
"mut"       @keyword.type
"fn"        @keyword.type

; Control flow
"if"       @keyword.control.conditional
"else"     @keyword.control.conditional
"guard"    @keyword.control.conditional
"for"      @keyword.control.repeat
"match"    @keyword.control
"ok"       @keyword.control
"error"    @keyword.control
"return"   @keyword.control.return
"continue" @keyword.control
"break"    @keyword.control
"end"      @keyword.control
"test"     @keyword.control
"assert"   @keyword.control

; Primitive types
(named_type (identifier) @type.builtin
  (#match? @type.builtin "^(i8|i16|i32|i64|u8|u16|u32|u64|usize|isize|f32|f64|bool|void|str|list)$"))

; Declarations
(function_def
  name: (function_name
    method: (identifier) @function.method))

(function_def
  name: (function_name
    (identifier) @function))

(type_def name: (identifier) @type)
(interface_def name: (identifier) @type)
(typeset_def name: (identifier) @type)

(function_def
  name: (function_name
    type: (identifier) @type))

; Calls
(call_expression function: (identifier) @function.call)
(method_call_expression method: (identifier) @function.method.call)
(intrinsic_call (intrinsic) @function.builtin)

; Generic params
(generic_param name: (identifier) @type.parameter)
(generic_param constraint: (identifier) @type)

; Variables
(var_statement name: (identifier) @variable)
(val_statement name: (identifier) @variable)
(param name: (identifier) @variable.parameter)
(field_decl name: (identifier) @variable.other.member)

; Field access
(field_expression (identifier) @variable.other.member)

; Struct literal fields
(struct_field_init name: (identifier) @variable.other.member)

; Operators
".."  @operator
"::"  @operator
"?"   @operator
"->"  @operator
"|"   @operator
"&"   @operator
"~"   @operator
"!"   @operator
"+"   @operator
"-"   @operator
"*"   @operator
"/"   @operator
"%"   @operator
"="   @operator
"=="  @operator
"!="  @operator
"<"   @operator
">"   @operator
"<="  @operator
">="  @operator
"++"  @operator
"--"  @operator
"+="  @operator
"-="  @operator
"*="  @operator
"/="  @operator

; Punctuation
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"," @punctuation.delimiter
":" @punctuation.delimiter
"." @punctuation.delimiter