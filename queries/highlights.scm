(doc_comment) @comment.doc
(line_comment) @comment.line
(string) @string
(escape_sequence) @constant.character.escape
(format_specifier) @string.special
(integer_literal) @constant.numeric.integer
(float_literal) @constant.numeric.float
(bool_literal) @constant.builtin.boolean
(none_literal) @constant.builtin

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

"if"       @keyword.control.conditional
"else"     @keyword.control.conditional
"guard"    @keyword.control.conditional
"for"      @keyword.control.repeat
"match"    @keyword.control
"ok"       @keyword.control
"error"    @keyword.control
"return"   @keyword.control.return
"end"      @keyword.control
"test"     @keyword.control
"assert"   @keyword.control

(named_type (identifier) @type.builtin
  (#match? @type.builtin "^(i8|i16|i32|i64|u8|u16|u32|u64|usize|isize|f32|f64|bool|void|str|list)$"))

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

(call_expression function: (identifier) @function.call)
(method_call_expression method: (identifier) @function.method.call)
(intrinsic_call (intrinsic) @function.builtin)

(generic_param name: (identifier) @type.parameter)
(generic_param constraint: (identifier) @type)

(var_statement name: (identifier) @variable)
(val_statement name: (identifier) @variable)
(param name: (identifier) @variable.parameter)
(field_decl name: (identifier) @variable.other.member)

(field_expression (identifier) @variable.other.member)

(struct_field_init name: (identifier) @variable.other.member)

".."  @operator
"::"  @operator
"?"   @operator
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
"+="  @operator
"-="  @operator
"*="  @operator
"/="  @operator

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"," @punctuation.delimiter
":" @punctuation.delimiter
"." @punctuation.delimiter
